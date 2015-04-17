Write a test for loadData.
Can now use idb-polyfill?

---

Use Khan Academy's `Drag Target` component to allow dropping of files

Drag Target
Stability unstable
DependsNone
Accept dragged content from the browser or the desktop.


var Target = React.createClass({
    render: function() {
        return <DragTarget onDrop={this.handleDrop}>
            {this.state.message}
        </DragTarget>;
    },

    handleDrop: function(event) {
        this.setState({ message: "delicious. thank you!" });
    },

    getInitialState: function() {
        return { message: "I haven't received any drags" };
    }
});

return <Target />;
