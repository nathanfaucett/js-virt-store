var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types");


var Component = virt.Component,
    ProviderPrototype;


module.exports = Provider;


function Provider(props, children, context) {
    Component.call(this, props, children, context);
}
Component.extend(Provider, "virt.store.Provider");
ProviderPrototype = Provider.prototype;

Provider.propTypes = {
    store: propTypes.implement({
        getState: propTypes.func.isRequired,
        dispatch: propTypes.func.isRequired
    }).isRequired,
    render: propTypes.func.isRequired
};

Provider.childContextTypes = {
    store: propTypes.implement({
        getState: propTypes.func.isRequired,
        dispatch: propTypes.func.isRequired
    })
};

ProviderPrototype.getChildContext = function() {
    return {
        store: this.props.store
    };
};

ProviderPrototype.render = function() {
    return this.props.render();
};