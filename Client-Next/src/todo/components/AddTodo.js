import React from 'react';

class AddTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {
                content: "",
                category: "",
                todoDate: props.todoDate, // Initialize with Date object
            },
        };
        this.add = props.add;
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            item: {
                ...prevState.item,
                [name]: value,
            },
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.add(this.state.item);
        this.setState({
            item: {
                content: "",
                category: "",
                todoDate: this.props.todoDate, // Reset to Date object
            },
        });
    };

    render() {
        const { content, category } = this.state.item;
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="content"
                    value={content}
                    onChange={this.handleChange}
                    placeholder="Add todo"
                />
                <input
                    type="text"
                    name="category"
                    value={category}
                    onChange={this.handleChange}
                    placeholder="Category"
                />
                <button type="submit">Add</button>
            </form>
        );
    }
}

export default AddTodo;
