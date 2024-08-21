import React from 'react';
import { ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material'; // Corrected import for DeleteOutlined

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            readOnly: true
        };
        this.delete = props.delete;
        this.update = props.update;
    }

    deleteEventHandler = () => {
        this.delete(this.state.item);
    };

    offReadOnlyMode = () => {
        this.setState({ readOnly: false });
    };

    editEventHandler = (e) => {
        const updatedItem = { ...this.state.item, [e.target.name]: e.target.value };
        this.setState({ item: updatedItem });
    };

    enterkeyEventHandler = (e) => {
        if (e.key === "Enter") {
            this.setState({ readOnly: true });
            this.update(this.state.item);
        }
    };

    checkboxEventHandler = (e) => {
        const updatedItem = { ...this.state.item, done: !this.state.item.done };
        this.setState({ item: updatedItem });
        this.update(updatedItem);
    };

    render() {
        const { item, readOnly } = this.state;

        return (
            <ListItem>
                <InputBase
                    inputProps={{ "aria-label": "Todo category", readOnly }}
                    type="text"
                    name="category"
                    value={item.category}
                    multiline={false}
                    onClick={this.offReadOnlyMode}
                    onChange={this.editEventHandler}
                    onKeyPress={this.enterkeyEventHandler}
                    style={{ display: "none" }}
                />
                <Checkbox
                    checked={item.done}
                    onChange={this.checkboxEventHandler}
                    style={{float: "left"}}
                />
                <ListItemText>
                    <InputBase
                        inputProps={{ "aria-label": "Todo content", readOnly }}
                        type="text"
                        name="content"
                        value={item.content}
                        multiline={true}
                        fullWidth={true}
                        onClick={this.offReadOnlyMode}
                        onChange={this.editEventHandler}
                        onKeyPress={this.enterkeyEventHandler}
                    />
                    <p style={{display: 'none'}}>{item.todoDate}</p>
                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete Todo" onClick={this.deleteEventHandler}>
                        <DeleteOutlined />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default Todo;
