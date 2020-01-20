import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

/**
 * A implementation of Ext.Template that supports React elements (JSX).
 *
 * Usage:
 *
 *  const tpl = new Template(data => (
 *      <div>
 *          <div> </div>
 *          <div></div>
 *      </div>
 *  ))
 *
 *  const html = tpl.apply({ firstName: 'Joe', lastName: 'Smith', title: 'CEO' });
 */
var Template = Ext.define(null, {
  extend: 'Ext.Template',

  /**
   * @param  fn A function that takes data values as an object and returns a React.Element to be rendered.
   */
  constructor(fn) {
    console.log(fn)
      this.fn = fn;
  },

  // overrides Ext.Template
  apply(values) {
      return ReactDOMServer.renderToStaticMarkup(this.fn(values));
  },

  // overrides Ext.Template
  doInsert(where, el, values, returnElement) {
      const target = this.getCachedTarget();
      this.doRender(values, target);
      const dom = target.firstChild;
      const result = Ext.dom.Helper.doInsert(el, dom, returnElement, where);
      this.unmountChildrenOnRemove(dom);
      return result;
  },

  // overrides Ext.Template
  overwrite(el, values, returnElement) {
      const dom = Ext.getDom(el);
      const result = this.doRender(values, dom);
      this.unmountChildrenOnRemove(dom);
      return returnElement ? new Ext.Element(dom) : dom;
  },

  /**
   * @private
   * @return 
   */
  getCachedTarget() {
      if (!this.cachedTarget) this.cachedTarget = document.createElement('div');
      return this.cachedTarget;
  },

  /**
   * Renders the result of this.fn to the specified target
   * @private
   * @param  values Values to pass to this.fn
   * @param  target The element into which the result should be rendered.
   * @return  The newly rendered element
   */
  doRender(values, target) {
      const reactElement = this.fn(values);
      ReactDOM.render(reactElement, target);
      return target.firstChild;
  },

  /**
   * Ensures that componentWillUnmount is called on each descendent component when the target node is removed from the DOM.
   * @param  target A node containing a React tree
   */
  unmountChildrenOnRemove(target) {
      const parent = target.parentNode;
      const parentKey = '$extreactObserveRemoveChild';
      const targetKey = '$extreactUnmountOnRemove';
      target[targetKey] = true; // we tag the target with $extreactUnmountOnRemove so we know it has a React tree to unmount when removed

      if (!parent[parentKey]) { // we tag the parent with $extreactObserveRemoveChild so we can ensure we are only observing it once
          parent[parentKey] = true;

          const observer = new MutationObserver(mutations => {
              mutations.forEach(({ removedNodes }) => {
                  for (let i=0; i<removedNodes.length; i++) {
                      let node = removedNodes[i];

                      if (node[targetKey]) {
                          ReactDOM.unmountComponentAtNode(node); // Unmount the React tree when the target dom node is removed.
                      }
                  }
              })
          });

          observer.observe(parent, { childList: true });
      }
  }
});

export default Template;

// Hook Ext.XTemplate.get so that we can just pass a function that returns JSX in place of a XTemplate.

