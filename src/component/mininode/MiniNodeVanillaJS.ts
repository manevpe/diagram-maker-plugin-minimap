import { DestroyCallback, DiagramMakerNode } from 'diagram-maker';
import { BoundRenderCallback } from 'diagramMakerMinimap/service';
import ComposeViewVanillaJS from '../common/ComposeViewVanillaJS';
import './MiniNode.scss';

export interface MiniNodeProps<NodeType> {
  renderCallback: BoundRenderCallback;
  destroyCallback: DestroyCallback;
  diagramMakerNode: DiagramMakerNode<NodeType>;
}

export default class MiniNodeVanillaJS<NodeType> implements MiniNodeProps<NodeType> {
  public renderCallback: BoundRenderCallback;
  public destroyCallback: DestroyCallback;
  public diagramMakerNode: DiagramMakerNode<NodeType>;

  constructor(
    renderCallback: BoundRenderCallback,
    destroyCallback: DestroyCallback,
    diagramMakerNode: DiagramMakerNode<NodeType>
  ) {
    this.renderCallback = renderCallback;
    this.destroyCallback = destroyCallback;
    this.diagramMakerNode = diagramMakerNode;
  }

  public getMiniNodeEl(): HTMLDivElement {
    const { diagramMakerData } = this.diagramMakerNode;
    const { x, y } = diagramMakerData.position;
    const { width, height } = diagramMakerData.size;
    const transform = `translate3d(${x}px, ${y}px, 0)`;

    const miniNode = document.createElement('div');
    miniNode.classList.add('dm-mini-node');
    miniNode.style.width = width.toString() + 'px';
    miniNode.style.height = height.toString() + 'px';
    miniNode.style.transform = transform;

    const composeView = new ComposeViewVanillaJS(this.renderCallback, this.destroyCallback).getComposeViewEl();
    miniNode.appendChild(composeView);

    return miniNode;
  }
}
