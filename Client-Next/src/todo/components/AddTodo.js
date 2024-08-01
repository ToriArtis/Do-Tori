import React from 'react';  
import { TextField, Paper, Button, Grid } from '@mui/material';

class AddTodo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item : {content: "", category:"", tododate:""},  
        };
        this.add = props.add;  //부모로부터 받은 것을 잘 담아둠
    }

    onInputChange = (e) => {
        const thisItem = this.state.item;
        thisItem.content = e.target.value;
        thisItem.category = document.getElementById("mySelect").value;
        thisItem.tododate = new Date();
        this.setState({item:thisItem});
        console.log(thisItem);
    }
    onButtonClick = () =>{
        this.add(this.state.item);
        this.setState({item:{content: "", category:"", tododate:""}});
    }
    enterKeyEventHandler = (e) => {
        if(e.key === 'Enter'){
            this.onButtonClick();
        }
    }
    render(){
        return(
            <Paper style={{ margin: 16, padding: 16}}>
                <Grid container>
                    <Grid xs={11} md={11} item style={{ paddingRight:16}}>
                        <select id="mySelect" name="category">
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>

                        <TextField 
                        placeholder="Add Todo here" 
                        fullWidth
                        onChange={this.onInputChange} 
                        value={this.state.item.content}
                        onKeyPress={this.enterKeyEventHandler}
                        />
                    </Grid>
                    <Grid xs={1} md={1} item>
                        <Button 
                        fullWidth color = "secondary" 
                        variant="contained"
                        onClick={this.onButtonClick}
                        >
                        +
                            </Button>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default AddTodo;