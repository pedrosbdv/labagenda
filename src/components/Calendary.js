import axios from "axios";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Calendary() {
    const [inputs, setInputs] = useState({ date: '' });
    const [labs, setLabs] = useState([]);

    // Função para buscar laboratórios
    const fetchLabs = (date) => {
        const url = date ? `http://127.0.0.1:5000/listlabsfilter?date=${date}` : 'http://127.0.0.1:5000/listlabsfilter'; // Adiciona a data na URL

        axios.get(url)
            .then(function (response) {
                setLabs(response.data);
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Não foi possível buscar os laboratórios.',
                });
            });
    };

    useEffect(() => {
        // Busca todos os laboratórios ao abrir a página
        fetchLabs();
    }, []); // Array vazio faz com que execute apenas uma vez na montagem do componente

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleReset = () => {
        setInputs({ date: '' });
        setLabs([]); // Limpa os laboratórios ao resetar
        fetchLabs(); // Recarrega todos os laboratórios
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário
        fetchLabs(inputs.date); // Chama a função para buscar laboratórios com a data selecionada
    };

    return (
        <div>
            <h5 className="card-title fw-semibold mb-4">Laboratórios Agendados</h5>
            <form method="GET" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="date"
                        placeholder="Digite a data de pesquisa"
                        name="date"
                        onChange={handleChange}
                        value={inputs.date}
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-secondary me-2">Pesquisar</button>
                    <button type="button" onClick={handleReset} className="btn btn-primary">Limpar</button>
                </div>
            </form>

            <div className='row mt-5 table-responsive'>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Sala</th>
                            <th scope="col">Horário Agendado</th>
                            <th scope="col">Professor Responsável</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.map((lab, key) =>
                            <tr key={key}>
                                <td scope="row">{lab.id}</td>
                                <td>{lab.labs_name}</td>
                                <td>{lab.hours}</td>
                                <td>{lab.responsible_teacher}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
