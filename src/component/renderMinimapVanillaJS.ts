import {
  DestroyCallback,
  DiagramMakerData
} from 'diagram-maker';
import {
  RenderCallback
 } from 'diagramMakerMinimap/service';
import MinimapVanillaJS from './minimap/MinimapVanillaJS';

export function createMinimapVanillaJS<NodeType, EdgeType>(
  state: DiagramMakerData<NodeType, EdgeType>,
  renderMiniNode: RenderCallback<NodeType>,
  destroyCallback: DestroyCallback
) {
  const minimapRoot = document.createElement('div');
  const minimap = new MinimapVanillaJS(state, renderMiniNode, destroyCallback);
  minimapRoot.appendChild(minimap.getMinimapEl());
  return minimapRoot;
}
