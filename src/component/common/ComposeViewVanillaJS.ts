import { DestroyCallback } from 'diagram-maker';
import { BoundRenderCallback } from 'diagramMakerMinimap/service';

interface ComposeViewProps {
  renderCallback: BoundRenderCallback;
  destroyCallback: DestroyCallback;
}

export default class ComposeView implements ComposeViewProps {
  public renderCallback: BoundRenderCallback;
  public destroyCallback: DestroyCallback;
  private diagramMakerContainer: HTMLElement | undefined;
  private consumerContainer: HTMLElement | undefined | void;

  constructor(
    renderCallback: BoundRenderCallback,
    destroyCallback: DestroyCallback
  ) {
    this.renderCallback = renderCallback;
    this.destroyCallback = destroyCallback;
  }

  public getComposeViewEl(): HTMLDivElement {
    const dmContent = document.createElement('div');
    dmContent.classList.add('dm-content');
    if (!this.diagramMakerContainer) {
      this.diagramMakerContainer = dmContent;
    }
    this.rerenderConsumerNode();
    return dmContent;
  }

  /* public componentDidMount = () => {
    this.rerenderConsumerNode();
  }

  public componentDidUpdate = () => {
    this.rerenderConsumerNode();
  }
  public componentWillUnmount = () => {
    // diagramMakerContainer is always available because this is called after render
    this.destroyCallback(this.diagramMakerContainer as HTMLElement, this.consumerContainer);
  } */

  private rerenderConsumerNode = () => {
    // diagramMakerContainer is always available because this is called after render
    this.consumerContainer =
      this.renderCallback(this.diagramMakerContainer as HTMLElement, this.consumerContainer);
  }
}
