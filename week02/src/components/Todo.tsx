import { useState } from "react";
import { TTodo } from "../types/todo";

const Todo = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const text = input.trim();

    if (text) {
      const newTodo: TTodo = { id: Date.now(), text };
      setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
      setInput(""); // 입력 완료 후 인풋 창 초기화
    }
  };

  // velog 쓰기
  const completeTodo = (todo: TTodo): void => {
    setTodos((prevTodos) => prevTodos.filter((t): boolean => t.id !== todo.id));
    setDoneTodos((prevDoneTodos): TTodo[] => [...prevDoneTodos, todo]);
  };

  const removeTodo = (todo: TTodo): void => {
    setDoneTodos((prevDoneTodos): TTodo[] =>
      prevDoneTodos.filter((t): boolean => t.id !== todo.id)
    );
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">Jay's Todo</h1>
      <form
        onSubmit={handleSubmit}
        id="todo-form"
        className="todo-container__form"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          id="todo-input"
          className="todo-container__input"
          placeholder="할 일 입력"
        />
        <button type="submit" className="todo-container__btn">
          추가
        </button>
      </form>
      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">Todo</h2>
          <ul id="todo-list" className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  onClick={() => completeTodo(todo)}
                  className="todo-container__btn"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="render-container__section">
          <h2 className="render-container__title">Done</h2>
          <ul id="done-list" className="render-container__list">
            {doneTodos.map((doneTodos) => (
              <li key={doneTodos.id} className="render-container__item">
                <span className="render-container__item-text">
                  {doneTodos.text}
                </span>
                <button
                  onClick={() => removeTodo(doneTodos)}
                  className="render-container__item-btn"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todo;
