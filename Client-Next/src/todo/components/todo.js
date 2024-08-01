import React from 'react';
import {ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton} from '@mui/material';
import { DeleteOutlined } from '@mui/material';
class Todo extends React.Component{
    constructor(props){
        super(props);
        this.state = {item : props.item, readOnly:true        };
        this.delete=props.delete;
        this.update = props.update;
        
    }
    deleteEventHandler = () =>{
        //app.js에서 실제로 작용 -> delete는 app.js에서 해야 함
        this.delete(this.state.item)
        //여기서 delete 함수는 app.js에서 전달받은 함수이다.
    };
    offReadOnlyMode=()=>{
        this.setState({readOnly:false},()=>{
            console.log("ReadOnly?", this.state.readOnly)
        });
    };

    editEventHandler=(e)=>{
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
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
                <Checkbox checked={item.done}
                    onChange={this.checkboxEventHandler} />
                <ListItemText>
                    <InputBase 
                        inputProps={{
                            "aria-label": "naked",
                            readOnly : this.state.readOnly,
                        }}
                        type="text"
                        id={item.id}
                        name={item.id}
                        value={item.title}
                        multiline = {true}
                        fullWidth = {true}
                        onClick={this.offReadOnlyMode}
                        onChange={this.editEventHandler}
                        onKeyPress={this.enterkeyEventHandler}
                    />

                </ListItemText>
                <ListItemSecondaryAction>
                    <IconButton aria-label="Delete Todo" onClick={this.deleteEventHandler}>
                        <DeleteOutlined />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
}
export default Todo;