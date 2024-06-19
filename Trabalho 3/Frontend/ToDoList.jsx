import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ToDoList.module.css';
import { useTheme } from '../../ThemeContext';

function ToDoList() {
    const [ToDos, setToDos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? styles.dark : styles.light;
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchToDos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/Projetos/To-Do-List/auth');
                return;
            }
            try {
                const response = await axios.get('https://app.jeanhenrique.site/Projetos/To-Do-List/todos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setToDos(response.data.todos);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Erro ao buscar tarefas:', error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/Projetos/To-Do-List/auth');
                }
            }
        };

        fetchToDos();

        // Limpeza ao desmontar o componente
        return () => {
            localStorage.removeItem('token');
        };
    }, [navigate]);

    const addToDo = async (text, priority, date) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('https://app.jeanhenrique.site/Projetos/To-Do-List/todos', {
                text, priority, date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToDos([...ToDos, response.data.task]);
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/Projetos/To-Do-List/auth');
            }
        }
    };

    const deleteToDo = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://app.jeanhenrique.site/Projetos/To-Do-List/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToDos(ToDos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/Projetos/To-Do-List/auth');
            }
        }
    };

    const completeToDo = async (id) => {
        const token = localStorage.getItem('token');
        const todo = ToDos.find(todo => todo.id === id);
        if (!todo) {
            console.error('Tarefa não encontrada');
            return;
        }
        try {
            await axios.put(`https://app.jeanhenrique.site/Projetos/To-Do-List/todos/${id}`, {
                ...todo, isCompleted: !todo.isCompleted
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setToDos(ToDos.map(todo =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            ));
        } catch (error) {
            console.error('Erro ao completar tarefa:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/Projetos/To-Do-List/auth');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={theme}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>To-Do-List de {username}</h1>
                    <ToDoSearch searchValue={searchTerm} setSearchValue={setSearchTerm} />
                </div>
                <div className={styles.grid}>
                    {ToDos.filter(todo => todo.text && todo.text.toLowerCase().includes(searchTerm.toLowerCase())).map(todo => (
                        <ToDo
                            key={todo.id}
                            todo={todo}
                            deleteToDo={deleteToDo}
                            completeToDo={completeToDo}
                            formatDate={formatDate} // Passe a função de formatação como prop
                        />
                    ))}
                </div>
                <ToDoForms addToDo={addToDo} />
            </div>
        </div>
    );
}

function ToDoForms({ addToDo }) {
    const [value, setValue] = useState('');
    const [priority, setPriority] = useState('');
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value || !priority || !date) return;

        addToDo(value, priority, date);
        setValue('');
        setPriority('');
        setDate('');
    };

    return (
        <div className={styles.CriarTarefa}>
            <h2>Criar tarefa</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tarefa"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="" disabled>Prioridade</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button type="submit">Criar</button>
            </form>
        </div>
    );
}

function ToDo({ todo, deleteToDo, completeToDo, formatDate }) { // Receba a função de formatação como prop
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Alta':
                return '#F96959';
            case 'Média':
                return '#aac3fe';
            case 'Baixa':
                return '#A0FAA6';
            default:
                return 'white';
        }
    };

    return (
        <div className={styles.ToDoList} style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
            <h1>{todo.text}</h1>
            <h2 className={styles.priorityTag} style={{ background: getPriorityColor(todo.priority) }}>
                {todo.priority}
            </h2>
            <h3>{formatDate(todo.date)}</h3>
            <div className={styles.buttons}>
                <button className={styles.completeButton} onClick={() => completeToDo(todo.id)}>Completar</button>
                <button className={styles.deleteButton} onClick={() => deleteToDo(todo.id)}>Remover</button>
            </div>
        </div>
    );
}

function ToDoSearch({ searchValue, setSearchValue }) {
    return (
        <div className={styles.ToDoSearch}>
            <input
                type="text"
                placeholder="Pesquisar por título..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    );
}

export default ToDoList;
