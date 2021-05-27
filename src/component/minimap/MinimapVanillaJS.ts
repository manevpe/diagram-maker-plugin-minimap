import {
  DestroyCallback,
  DiagramMakerData,
  DiagramMakerNode,
  DiagramMakerNodes,
  DiagramMakerWorkspace,
  Size
} from 'diagram-maker';
import MiniNodeVanillaJS from 'diagramMakerMinimap/component/mininode/MiniNodeVanillaJS';
import {
  DiagramMakerMinimapType,
  getRectOffset,
  getRectSize,
  getScale,
  RenderCallback
} from 'diagramMakerMinimap/service';
import './Minimap.scss';

export interface MinimapProps<NodeType, EdgeType> {
  state: DiagramMakerData<NodeType, EdgeType>;
  renderMiniNode: RenderCallback<NodeType>;
  destroyCallback: DestroyCallback;
}

export default class MinimapVanillaJS<NodeType, EdgeType> implements MinimapProps<NodeType, EdgeType> {
  public state: DiagramMakerData<NodeType, EdgeType>;
  public renderMiniNode: RenderCallback<NodeType>;
  public destroyCallback: DestroyCallback;

  constructor(
    state: DiagramMakerData<NodeType, EdgeType>,
    renderMiniNode: RenderCallback<NodeType>,
    destroyCallback: DestroyCallback
  ) {
    this.state = state;
    this.renderMiniNode = renderMiniNode;
    this.destroyCallback = destroyCallback;
  }

  public getMinimapEl(): HTMLDivElement {
    const plugins = this.state.plugins;
    // If plugins are disbaled, return an empty div
    if (!plugins) return document.createElement('div');

    const minimap = plugins.minimap;
    const workspace = this.state.workspace;
    const nodes = this.state.nodes;

    const scale = getScale(workspace, minimap);
    const containerSize = minimap.data.size;
    const canvasSize = this.getCanvasSize(workspace, containerSize, scale);
    const emptyTop = (containerSize.height - canvasSize.height) / 2;
    const emptyLeft = (containerSize.width - canvasSize.width) / 2;

    const rectOffset = getRectOffset(workspace, scale);
    const rectSize = getRectSize(workspace, scale);
    const rectTransform = `translate3d(${rectOffset.x + emptyLeft}px, ${rectOffset.y + emptyTop}px, 0)`;

    const renderedMinimapNodes = this.renderMinimapNodes(nodes, scale) as HTMLDivElement[];
    const renderedMinimapNodesContainer = document.createElement('div');
    for (const i of renderedMinimapNodes) {
      renderedMinimapNodesContainer.appendChild(i);
    }

    const minimapContainer = document.createElement('div');
    minimapContainer.classList.add('dm-minimap-container');
    minimapContainer.style.width = containerSize.width;
    minimapContainer.style.height = containerSize.height;
    minimapContainer.innerHTML = `
      <div
        data-event-target="true"
        data-draggable="true"
        data-type="` + DiagramMakerMinimapType.RECTANGLE + `"
        style="transform: ` + rectTransform + `; width: ` + rectSize.width + `px; height: ` + rectSize.height + `px;"
        class="dm-minimap-rectangle"
      >
      </div>
      <div
        data-event-target="true"
        data-type="` + DiagramMakerMinimapType.CANVAS + `"
        class="dm-minimap-canvas"
        style="width: ` + canvasSize.width + `px; height: ` + canvasSize.height +
        `px; top: ` + emptyTop + `px; left: ` + emptyLeft + `px;"
      >
        ` + renderedMinimapNodesContainer.innerHTML + `
      </div>
    `;
    return minimapContainer;
  }

  private getCanvasSize(workspace: DiagramMakerWorkspace, containerSize: Size, scale: number): Size {
    const { height: workspaceHeight, width: workspaceWidth } = workspace.canvasSize;
    const { height: containerHeight, width: containerWidth } = containerSize;

    const workspaceRatio = workspaceWidth / workspaceHeight;
    const containerRatio = containerWidth / containerHeight;

    let canvasWidth = containerWidth;
    let canvasHeight = containerHeight;

    if (workspaceRatio > containerRatio) {
      // Short and fat, fill empty space at the top and bottom
      canvasHeight = workspaceHeight / scale;
    } else {
      // Tall and thin, fill empty space at the left and right
      canvasWidth = workspaceWidth / scale;
    }

    const canvasSize = {
      height: canvasHeight,
      width: canvasWidth
    };
    return canvasSize;
  }

  private getMinimapNode(node: DiagramMakerNode<NodeType>, scale: number): DiagramMakerNode<NodeType> {
    const { diagramMakerData: orignalDiagramMakerData, id } = node;
    const { x, y } = orignalDiagramMakerData.position;
    const { width, height } = orignalDiagramMakerData.size;
    const miniNodePos = {
      x: x / scale,
      y: y / scale
    };
    const miniNodeSize = {
      height: height / scale,
      width: width / scale
    };
    const miniNodeData = {
      position: miniNodePos,
      size: miniNodeSize
    };
    const diagramMakerData = miniNodeData;
    const miniNode = {
      diagramMakerData,
      id
    };
    return miniNode;
  }

  private renderMinimapNodes<HTMLDivElement>(nodes: DiagramMakerNodes<NodeType>, scale: number) {
    const renderCallback = this.renderMiniNode;
    const destroyCallback = this.destroyCallback;

    const nodeKeys = Object.keys(nodes);
    return nodeKeys.map((nodeKey: string) => {
      const miniNode = this.getMinimapNode(nodes[nodeKey], scale);
      const miniNodeEl = new MiniNodeVanillaJS(
        renderCallback.bind(null, nodes[nodeKey]),
        destroyCallback,
        miniNode
      ).getMiniNodeEl();
      return miniNodeEl;
    });
  }
}
