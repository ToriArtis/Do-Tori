import React from 'react';
import {ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton} from '@mui/material';
import { DeleteOutlined } from '@mui/material';
class Todo extends React.Component{

    constructor(props){
        super(props);
        this.state = {item : props.item, readOnly:true};
        console.log(this.state.item);
        this.delete = props.delete;
        this.update = props.update;
        
    }

    deleteEventHandler = () =>{
        this.delete(this.state.item)
    };
    offReadOnlyMode=()=>{
        this.setState({readOnly:false},()=>{
            console.log("ReadOnly?", this.state.readOnly)
        });
    };

    editEventHandler=(e)=>{
        const thisItem = this.state.item;
        thisItem.content = e.target.value;
        this.setState({item: thisItem});
    };
    enterkeyEventHandler = (e) =>{
        if(e.key ==="Enter") {
            this.setState({readOnly: true});
            this.update(this.state.item);
        }
    };
    checkboxEventHandler = (e)=>{
        const thisItem = this.state.item;
        thisItem.done= !thisItem.done;
        this.setState({item:thisItem});
        this.update(this.state.item);
    };
    render(){

        const item= this.state.item;
        return(
            <ListItem>
                <Checkbox checked={item.done} onChange={this.checkboxEventHandler} />
                <ListItemText>
                    <select id="mySelect" name="category" value={item.category}>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <InputBase 
                        inputProps={{
                            "aria-label": "naked",
                            readOnly : this.state.readOnly,
                        }}
                        type="text"
                        id={item.id.toString()}
                        name={item.id.toString()}
                        value={item.content}
                        multiline = {true}
                        fullWidth = {true}
                        onClick={this.offReadOnlyMode}
                        onChange={this.editEventHandler}
                        onKeyPress={this.enterkeyEventHandler}
                    />

                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete Todo" onClick={this.deleteEventHandler}>
                        <Checkbox /> 
                        {/* 추후 수정 예정 */}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}
export default Todo;