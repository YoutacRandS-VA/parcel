// @flow strict-local

import {Runtime} from '@parcel/plugin';
import {urlJoin} from '@parcel/utils';

export default (new Runtime({
  apply({bundle, bundleGraph}) {
    if (bundle.env.context !== 'node') {
      return [];
    }

    let asset = bundle.traverse((node, _, actions) => {
      if (
        node.type === 'dependency' &&
        node.value.specifier === '@parcel/rsc-manifest' &&
        !bundleGraph.isDependencySkipped(node.value)
      ) {
        actions.stop();
        return bundleGraph.getResolvedAsset(node.value, bundle);
      }
    });

    if (!asset) {
      return [];
    }

    let manifest = {};
    bundleGraph.traverse(node => {
      if (node.type === 'asset') {
        let asset = node.value;
        if (asset.meta.isClientComponent === true) {
          let id = bundleGraph.getAssetPublicId(asset);
          let b = bundleGraph.getBundlesWithAsset(asset)[0]; // TODO
          let bundles = bundleGraph.getReferencedBundles(b, {recursive: true});
          let chunks = [b, ...bundles].flatMap(b => [urlJoin(b.target.publicUrl, b.name), urlJoin(b.target.publicUrl, b.name)]);
          let exports = {};
          for (let symbol of asset.symbols.exportSymbols()) {
            manifest[asset.filePath + '#' + symbol] = {
              id,
              chunks,
              name: symbol
            };
          }
        }
      }
    });

    let code = `import {_register} from '@parcel/rsc-manifest';
_register(${JSON.stringify(manifest, null, 2)});
`;

    return {
      filePath: asset.filePath,
      code,
      isEntry: true,
      env: {sourceType: 'module'},
    }
  },
}): Runtime);