'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import { GraphNode, useSelection } from 'reagraph';

import BottomSheet from '@/components/ui/bottom-sheet';
import { cn } from '@/lib/utils';
import { Company, CompanyDetail } from '@/types/company';

const GraphCanvas = dynamic(
	() => import('reagraph').then((mod) => mod.GraphCanvas),
	{ ssr: false }
);

interface RelationsData {
	name: string;
	inReasons: (string | null)[];
	outReasons: (string | null)[];
}

interface RelationsContentProps {
	relations: RelationsData | null;
}

// 관계 정보 표시 컴포넌트
const RelationsContent: FC<RelationsContentProps> = ({ relations }) => {
	if (!relations) return null;

	return (
		<div className="space-y-4">
			{/* IN 관계 */}
			{relations.inReasons.length > 0 && (
				<div>
					<div className="font-medium text-blue-600 mb-2 text-sm">IN</div>
					<ul className="space-y-1.5 text-muted-foreground pl-2">
						{relations.inReasons.map((reason, index) => {
							if (!reason) return null;
							return (
								<li key={index} className="flex items-start gap-1.5 text-sm">
									<span className="text-blue-500 mt-0.5">•</span>
									<span>{reason}</span>
								</li>
							);
						})}
					</ul>
				</div>
			)}
			{/* OUT 관계 */}
			{relations.outReasons.length > 0 && (
				<div>
					<div className="font-medium text-green-600 mb-2 text-sm">OUT</div>
					<ul className="space-y-1.5 text-muted-foreground pl-2">
						{relations.outReasons.map((reason, index) => {
							if (!reason) return null;
							return (
								<li key={index} className="flex items-start gap-1.5 text-sm">
									<span className="text-green-500 mt-0.5">•</span>
									<span>{reason}</span>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
};

interface CompanyNetworkGraphProps {
	companyData: CompanyDetail;
}

const CompanyNetworkGraph: FC<CompanyNetworkGraphProps> = ({ companyData }) => {
	const graphRef = useRef<any>(null);
	const centerNodeId = companyData.companyId || companyData.name;
	const [isMobile, setIsMobile] = useState(false);
	const [hoveredNode, setHoveredNode] = useState<{
		node: GraphNode;
		mouseX: number;
		mouseY: number;
	} | null>(null);
	const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
	const [pathSelectionType, setPathSelectionType] = useState<
		'in' | 'out' | 'all'
	>('in');

	// 노드 색상 결정 함수 (메모이제이션)
	const getNodeColor = useCallback((tags: Company['tags'] = []): string => {
		// 1. label='투자사'인 경우
		const hasInvestorTag = tags.some((tag) => tag.label === '투자사');
		if (hasInvestorTag) {
			return '#dc9192';
		}

		// 2. newsId가 null이 아닌 경우
		const hasNewsId = tags.some((tag) => tag.newsId != null);
		if (hasNewsId) {
			return '#efe298';
		}

		// 3. 이외 나머지 노드들
		return '#8468b3';
	}, []);

	// 네트워크 그래프 노드 및 엣지 생성
	const { nodes, edges } = useMemo(() => {
		// 노드 Map: id를 키로 하여 중복 제거
		const nodeMap = new Map<string, GraphNode>();

		// 중심 노드 추가
		nodeMap.set(centerNodeId, {
			id: centerNodeId,
			label: companyData.name,
			fill: '#3b83f6',
			size: 40,
			data: companyData,
		});

		// Edge Map: source-target 쌍을 키로 하여 가중치 및 방향 계산
		const edgeMap = new Map<
			string,
			{
				source: string;
				target: string;
				weight: number;
				inCount: number;
				outCount: number;
			}
		>();

		// 관련 기업들을 순회하며 노드와 엣지 생성
		companyData.related.forEach((related) => {
			const relatedId = related.companyId || related.name;

			// 노드 추가 (이미 있으면 스킵)
			if (!nodeMap.has(relatedId)) {
				const tags = related.tags || [];
				const nodeColor = getNodeColor(tags);
				nodeMap.set(relatedId, {
					id: relatedId,
					label: related.name,
					fill: nodeColor,
					size: 40,
					data: related,
				});
			}

			// tags에서 direction 정보 추출
			const tags = related.tags || [];
			const inCount = tags.filter((tag) => tag.direction === 'IN').length;
			const outCount = tags.filter((tag) => tag.direction === 'OUT').length;

			// 방향 결정: 더 많은 방향을 우선, 같으면 OUT (기본값)
			const isIn = inCount > outCount;
			const source = isIn ? relatedId : centerNodeId;
			const target = isIn ? centerNodeId : relatedId;
			const edgeKey = `${source}-${target}`;

			// 엣지 가중치 및 방향 카운트 계산
			const existingEdge = edgeMap.get(edgeKey);
			if (existingEdge) {
				existingEdge.weight += 1;
				existingEdge.inCount += inCount;
				existingEdge.outCount += outCount;
			} else {
				edgeMap.set(edgeKey, {
					source,
					target,
					weight: 1,
					inCount,
					outCount,
				});
			}
		});

		// 노드 배열로 변환
		const graphNodes = Array.from(nodeMap.values());

		// 엣지 배열로 변환 (가중치에 따라 size 조정, 방향에 따라 색상)
		const graphEdges = Array.from(edgeMap.values()).map((edge) => {
			const label = edge.weight > 1 ? `${edge.weight}` : '';

			return {
				id: `${edge.source}-${edge.target}`,
				source: edge.source,
				target: edge.target,
				label,
				size: 1,
				fill: '#DBDBDB',
			};
		});

		return { nodes: graphNodes, edges: graphEdges };
	}, [companyData, centerNodeId]);

	const {
		selections,
		actives,
		onNodeClick: defaultOnNodeClick,
		onCanvasClick,
	} = useSelection({
		ref: graphRef,
		nodes,
		edges,
		pathSelectionType,
	});

	// 노드 색상을 동적으로 업데이트 (actives, selections, hoveredNode에 따라)
	const coloredNodes = useMemo(() => {
		const activeNodeIds = new Set<string>();

		// actives에서 노드 ID 추출
		if (Array.isArray(actives)) {
			actives.forEach((n) => {
				if (typeof n === 'object' && n !== null && 'id' in n) {
					activeNodeIds.add((n as GraphNode).id);
				} else if (typeof n === 'string') {
					activeNodeIds.add(n);
				}
			});
		}

		// selections에서 노드 ID 추출
		if (Array.isArray(selections)) {
			selections.forEach((n) => {
				if (typeof n === 'object' && n !== null && 'id' in n) {
					activeNodeIds.add((n as GraphNode).id);
				} else if (typeof n === 'string') {
					activeNodeIds.add(n);
				}
			});
		}

		// hoveredNode 추가
		if (hoveredNode) {
			activeNodeIds.add(hoveredNode.node.id);
		}

		return nodes.map((node) => {
			// 중심 노드는 항상 원래 색상 유지
			if (node.id === centerNodeId) {
				return node;
			}

			// 노드의 원래 색상 가져오기 (data에서 tags 확인)
			const nodeData = node.data as Company | undefined;
			const tags = nodeData?.tags || [];
			const nodeColor = getNodeColor(tags);

			// 활성화된 노드인 경우 원래 색상으로 하이라이트
			if (activeNodeIds.has(node.id)) {
				return {
					...node,
					fill: nodeColor,
				};
			}

			// 비활성화된 노드는 원래 색상 유지 (약간 투명하게)
			return {
				...node,
				fill: nodeColor,
				opacity: 0.3,
			};
		});
	}, [nodes, actives, selections, hoveredNode, centerNodeId, getNodeColor]);

	// 노드 클릭 핸들러 (모바일용)
	const handleNodeClick = (node: any) => {
		// 기본 선택 동작 실행
		defaultOnNodeClick?.(node);

		// 모바일이고 메인 노드가 아닌 경우 바텀시트 표시
		if (isMobile && node.id !== centerNodeId && node.data) {
			setSelectedNode(node);
		} else {
			setSelectedNode(null);
		}
	};

	// 노드 hover 핸들러 (데스크탑용)
	const handleNodePointerOver = (node: any, event: any) => {
		// 데스크탑이고 메인 노드가 아닌 경우에만 Popover 표시
		if (!isMobile && node.id !== centerNodeId && node.data) {
			setHoveredNode({
				node,
				mouseX: event?.clientX || 0,
				mouseY: event?.clientY || 0,
			});
		}
	};

	const handleNodePointerOut = () => {
		if (!isMobile) {
			setHoveredNode(null);
		}
	};

	// 노드의 관계 정보 정리 (hover 또는 선택된 노드)
	const nodeRelations = useMemo(() => {
		const targetNode = hoveredNode?.node || selectedNode;
		if (!targetNode?.data) return null;

		const relatedCompany = targetNode.data as Company;
		const tags = relatedCompany.tags || [];

		const inReasons = tags
			.filter((tag) => tag.direction === 'IN')
			.map((tag) => tag.relReason);
		const outReasons = tags
			.filter((tag) => tag.direction === 'OUT')
			.map((tag) => tag.relReason);

		return {
			name: relatedCompany.name,
			inReasons: Array.from(new Set(inReasons)), // 중복 제거
			outReasons: Array.from(new Set(outReasons)), // 중복 제거
		};
	}, [hoveredNode, selectedNode]);

	// 모바일 여부 감지
	useEffect(() => {
		const checkMobile = () => {
			const flag = window.innerWidth < 1024;
			setIsMobile(flag); // lg 브레이크포인트
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<>
			{/* 방향 선택 UI */}
			<div className="flex justify-between items-center mb-4">
				<h3 className="absolute top-6 left-6 z-10 text-base sm:text-lg font-bold">
					관계도
				</h3>
				<div className="absolute top-4 right-4 z-10 flex gap-1 sm:gap-2 bg-white/90 backdrop-blur-sm border border-border rounded-lg p-0.5 sm:p-1">
					<button
						type="button"
						onClick={() => setPathSelectionType('in')}
						className={cn(
							'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors',
							pathSelectionType === 'in'
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-muted'
						)}
					>
						IN
					</button>
					<button
						type="button"
						onClick={() => setPathSelectionType('out')}
						className={cn(
							'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors',
							pathSelectionType === 'out'
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-muted'
						)}
					>
						OUT
					</button>
					<button
						type="button"
						onClick={() => setPathSelectionType('all')}
						className={cn(
							'px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors',
							pathSelectionType === 'all'
								? 'bg-primary text-primary-foreground'
								: 'text-muted-foreground hover:bg-muted'
						)}
					>
						ALL
					</button>
				</div>
			</div>
			<GraphCanvas
				ref={graphRef}
				nodes={coloredNodes}
				edges={edges}
				selections={selections}
				actives={actives}
				onCanvasClick={(e) => {
					onCanvasClick?.(e);
					if (isMobile) {
						setSelectedNode(null);
					}
				}}
				onNodeClick={handleNodeClick}
				onNodePointerOver={handleNodePointerOver}
				onNodePointerOut={handleNodePointerOut}
				layoutType="forceDirected2d"
				labelType="all"
				edgeInterpolation="linear"
			/>
			{/* 관계 정보 Popover (데스크탑용) */}
			{!isMobile && hoveredNode && nodeRelations && (
				<div
					className="fixed z-50 pointer-events-none hidden lg:block"
					style={{
						left: `${hoveredNode.mouseX + 10}px`,
						top: `${hoveredNode.mouseY + 10}px`,
					}}
				>
					<div className="bg-white border border-border rounded-lg shadow-lg p-4 max-w-xs pointer-events-auto">
						<h3 className="font-semibold text-sm mb-3">{nodeRelations.name}</h3>
						<RelationsContent relations={nodeRelations} />
					</div>
				</div>
			)}
			{/* 관계 정보 바텀시트 (모바일용) */}
			{isMobile && selectedNode && nodeRelations && (
				<BottomSheet
					open={!!selectedNode}
					onClose={() => setSelectedNode(null)}
					title={nodeRelations.name}
				>
					<RelationsContent relations={nodeRelations} />
				</BottomSheet>
			)}
		</>
	);
};

export default CompanyNetworkGraph;
