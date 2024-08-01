import { Container, Paper, List } from '@mui/material';
import { useTodoViewModel } from '@/todo/viewmodels/todoViewModels';
import Todo from '@/todo/components/todo';
import AddTodo from '@/todo/components/AddTodo';

function TodoPage() {
    const { items, addTodo, deleteTodo, updateTodo } = useTodoViewModel();

    const todoItems = items.length > 0 && (
        <Paper style={{margin:16}}>
            <List>
                {items.map((item) => (
                    <Todo 
                        item={item} 
                        key={item.id} 
                        delete={deleteTodo}
                        update={updateTodo}
                    />
                ))}
            </List>
        </Paper>
    );

    return (
        <div className="App">
            <Container maxWidth="md">
                <AddTodo add={addTodo}/> 
                <div className='TodoList'>{todoItems}</div>
            </Container>
        </div>
    );   
}

export default TodoPage;