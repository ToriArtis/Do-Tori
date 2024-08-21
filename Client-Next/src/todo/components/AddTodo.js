import React from 'react';
import './css/AddTodo.css';

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

    componentDidUpdate(prevProps) {
        // Update state when todoDate prop changes
        if (prevProps.todoDate !== this.props.todoDate) {
            this.setState({
                item: {
                    ...this.state.item,
                    todoDate: this.props.todoDate,
                },
            });
        }
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
            <form onSubmit={this.handleSubmit} class="selectBox">
                <select name="category" value={category} onChange={this.handleChange} className="form-control select">
                    <option value="No category">No category</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Study">Study</option>
                    <option value="Habit">Habit</option>
                </select>
                <input
                    type="text"
                    name="content"
                    value={content}
                    onChange={this.handleChange}
                    className="addTodoText"
                    placeholder="Add todo"
                />
                <button type="submit" style={{ marginLeft: "10px", border: "none", background: "white", cursor: "pointer", float: "right"}}>➕</button>
            </form>
        );
    }
}

export default AddTodo;
