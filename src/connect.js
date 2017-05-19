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
        this._mappedProps = Connect_mapProps(this._store, props);
        this._shouldComponentUpdate = false;

        this._onUpdate = function onUpdate(state, action) {
            return Connect_onUpdate(_this, state, action);
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
        this._shouldComponentUpdate = Connect_shouldComponentUpdate(
            this,
            Connect_mapProps(this._store, nextProps),
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

    function Connect_shouldComponentUpdate(_this, nextProps, nextChildren, nextContext) {
        var prevProps = _this._mappedProps;

        _this._mappedProps = nextProps;
        _this._store = nextProps.store || nextContext.store;

        return (
            notEqual(prevProps, nextProps) ||
            notEqual(nextChildren, nextChildren)
        );
    }

    function Connect_onUpdate(_this /*, state, action */ ) {
        _this.componentWillReceiveProps(
            Connect_mapProps(_this._store, _this.props),
            _this.children,
            _this.context
        );

        if (_this._shouldComponentUpdate) {
            _this.forceUpdate();
        }
    }

    function Connect_mapProps(store, ownProps) {
        return extend({},
            mapDispatchToProps(store.dispatch, ownProps),
            mapStateToProps(store.getState(), ownProps)
        );
    }


    return Connect;
}