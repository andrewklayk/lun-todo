import React from 'react';
import logo from './logo.svg';
import './App.css';
import { inherits } from 'util';
import { yellow } from 'ansi-colors';

function withLoading(Component){
  return ({isLoading, ...rest}) => (
    isLoading
     ? 'loading...'
     : <Component {...rest}/>
  );
}

class App extends React.Component {
  state = {
    newTodo: '',
    todos: [],
    loading: false,
    sorting: 'all',
  };

  count = 0;
  todoId = 1;

  handleInputChange = event => {
    this.setState({
      newTodo: event.target.value   //returns the value of the whatever input it was triggered by
    });
  };

  handleSubmitButtonClick = () => {
    if(this.state.newTodo.trim() !== "")
    {
      const newTodo = {
        text: this.state.newTodo,
        isDone: false,
        id: this.todoId
      };

      this.todoId++;
      this.count++;
      
      this.inputRef.current.focus();

      this.setState({
        todos: [
          ...this.state.todos,
          newTodo
        ],
        
        newTodo: '',
      });
    }

  };
  handleEnterPress = event => {
    if(event.key === 'Enter') {
      this.handleSubmitButtonClick();
    }
  };

  handleTodoClick = todoId => {
    const foundTodo = this.state.todos.find(
      todo => todo.id === todoId
    );
    const nextTodo = {
      ...foundTodo,
      isDone: !foundTodo.isDone
    };

    const finalNextTodos = this.state.todos.map(todo=>(todo.id === todoId ? nextTodo : todo));

    this.setState({
      todos: finalNextTodos
    })
  }
  
  componentDidMount(){
    this.inputRef.current.focus();
  }

  handleTodoDelete = todoId => {
    const foundTodo = this.state.todos.find(
      todo => todo.id === todoId
    );
    const nextTodos = this.state.todos.filter(
      todo => todo.id !== todoId
    )
    
    this.count--;
    
    this.setState({
      todos: nextTodos
    })
  }

  handleNameChange = event => {
    this.setState ({
      name: event.target.value
    })
  }

  handleSortingButtonChange = event => {
    console.log(event.target.value);
    this.setState({
      sorting: event.target.value,
    })
    console.log('biba')
  }

  inputRef = React.createRef()


  render() {
    return (
     <div className="App">
        <div className="main-content">
          <textarea className="todo-input"
            ref = {this.inputRef}
            onChange={this.handleInputChange}
            value ={this.state.newTodo}
            onKeyPress={this.handleEnterPress}
            placeholder="Thine deeds of utmost importance..."
          />
          <div className={"todo-list"} >
            {
              this.state.todos.filter(this.state.sorting==='all' ? todo=>todo : (this.state.sorting==='done' ? todo=>todo.isDone : todo=>!todo.isDone)).map(         //.filter(this.a ? todo=>!todo.isDone : todo=>todo.isDone)
                (todo) => (  //індекс у якості key - погано, бо тоді при сортуванні поміняється співвідношення key з ел-том у всіх ел-тів, і реакт буде перерендерити ВСЕ
                  <li key = {todo.id}
                  className = {todo.isDone ? "Todo-completed Todo row" : "Todo row"}> 
                  <span className="column column-left"
                    onClick = {
                      () => this.handleTodoClick(todo.id)
                    }
                  >
                    {todo.text}
                  </span>
                  <div className="column column-right">
                    <button className="delete-button"
                      onClick={
                        () => this.handleTodoDelete(todo.id)
                        }
                      >
                    </button>
                  </div>
                </li>                        //onClick = {function()} would CALL the function; onClick = {function} would pass it with no params
                )                            // {() => F(param)} is equal to {this.F.bind(this, param)}
              )                              //{() => func(param)} - syntax for passing params to a function while passing the function to a component
            }
          
          </div>
          <div className="radios">
          <label>
            All
            <input type="radio" name="sorting" value="all" checked={this.state.sorting==="all" ? true : false} onChange={this.handleSortingButtonChange}></input>
          </label>
          <label>
            Pending
            <input type="radio" name="sorting" value="pending" onChange={this.handleSortingButtonChange}></input>
          </label>
          <label>
            Done
            <input type="radio" name="sorting" value="done" onChange={this.handleSortingButtonChange}></input>
          </label>
          {(this.state.todos.filter(todo=>!todo.isDone).length !== 0 ? 
          <p>Only {this.state.todos.filter(todo=>!todo.isDone).length} left to do!</p> : <p>Everything seems done!</p>)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
