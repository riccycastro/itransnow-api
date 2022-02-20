'use strict';

import edge from 'edge.js';

export const engine = (req, res, next) => {
  const edgeRenderer = edge.getRenderer();
  /*
            |-------------------------------------------------------------------------------------------------
            | Override the app.render function so that we can use dot notation
            |-------------------------------------------------------------------------------------------------
            */

  const { render } = res;

  res.render = function _render(view, options, callback) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    render.call(self, view.replace(/\./gi, '/'), options, callback);
  };

  res.share = edgeRenderer.share;

  /*
            |-------------------------------------------------------------------------------------------------
            | Register the edge view engine
            |-------------------------------------------------------------------------------------------------
            */

  req.app.engine('edge', (filePath, options, callback) => {
    edge.mount(req.app.settings.views);

    edgeRenderer
      .render(filePath, options)
      .then((content) => callback(null, content))
      .catch((err) => callback(err));
  });

  /*
            |-------------------------------------------------------------------------------------------------
            | Set the app view engine
            |-------------------------------------------------------------------------------------------------
            */

  req.app.set('view engine', 'edge');

  next();
};
