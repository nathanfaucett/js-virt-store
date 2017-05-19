var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    extend = require("@nathanfaucett/extend"),
    notEqual = require("./notEqual");


var Component = virt.Component;


module.exports = connect;


function connect(mapStateToProps, mapDispatchToProps, WrappedComponent) {
    var ConnectPrototype;


    function Connect(props, children, context) {
        var _this = this;

        Component.call(this, props, children, context);

        this._unsubscribe = null;
        this._store = props.store || context.store;

        this._mappedState = mapStateToProps(this._store.getState(), props);
        this._mappedDispatch = mapDispatchToProps(this._store.dispatch, props);
        this._mappedProps = extend({}, this._mappedState, this._mappedDispatch);
        this._shouldComponentUpdate = false;

        this._onUpdate = function(state) {
            return onUpdate(_this, state);
        };
    }
    Component.extend(Connect, "virt.store.Connect");
    ConnectPrototype = Connect.prototype;

    Connect.contextTypes = {
        store: propTypes.implement({
            getState: propTypes.func.isRequired,
            dispatch: propTypes.func.isRequired
        }).isRequired
    };

    ConnectPrototype.componentDidMount = function() {
        this._unsubscribe = this._store.subscribe(this._onUpdate);
    };

    ConnectPrototype.componentWillUnmount = function() {
        this._unsubscribe();
    };

    ConnectPrototype.componentWillReceiveProps = function(nextProps, nextChildren, nextContext) {
        this._shouldComponentUpdate = shouldComponentUpdate(
            this,
            nextProps,
            nextChildren,
            nextContext
        );
    };

    ConnectPrototype.shouldComponentUpdate = function() {
        var shouldComponentUpdate = this._shouldComponentUpdate;
        this._shouldComponentUpdate = false;
        return shouldComponentUpdate;
    };

    ConnectPrototype.render = function() {
        return virt.createView(WrappedComponent, this._mappedProps, this.children);
    };

    function shouldComponentUpdate(_this, nextProps, nextChildren, nextContext) {
        var prevMappedState = _this._mappedState,
            prevChildren = _this.children;

        _this._store = nextProps.store || nextContext.store;
        _this._mappedState = mapStateToProps(_this._store.getState(), nextProps);
        _this._mappedDispatch = mapDispatchToProps(_this._store.dispatch, nextProps);
        _this._mappedProps = extend({}, _this._mappedState, _this._mappedDispatch);

        return (
            notEqual(prevMappedState, _this._mappedState) ||
            notEqual(prevChildren, nextChildren)
        );
    }

    function onUpdate(_this /*, state, action */ ) {
        _this.componentWillReceiveProps(
            _this.props,
            _this.children,
            _this.context
        );

        if (_this._shouldComponentUpdate) {
            _this.forceUpdate();
        }
    }


    return Connect;
}