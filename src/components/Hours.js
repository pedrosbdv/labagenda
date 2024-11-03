import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


export default function Hours() {


    const [inputs, setInputs] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleReset = () => {
        setInputs({
            time_off: '',
            time_until: ''
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
         if (inputs[["time_off"]] == undefined || inputs[["time_until"]] == undefined) {
            Swal.fire({ icon: 'warning', title: 'Atenção!', text: 'Todos os campos precisam ser preenchidos!' })
            return
        }

        Swal.fire({
            title: 'Deseja cadastrar o horario ?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: "#fa896b",
            confirmButtonColor: "#13deb9",
            confirmButtonText: 'Sim, cadastrar!',
            cancelButtonText: 'Não, cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Envia os dados se o usuário confirmar
                axios.post('http://127.0.0.1:5000/hoursadd', inputs)
                    .then(response => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sucesso!',
                            text: 'Dados cadastrados com sucesso!',
                        }).then(() => {
                            // Recarrega a página após o usuário fechar o swal
                            window.location.reload();
                        });;
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: 'Houve um problema ao cadastrar os dados.',
                        });
                    });
            }
        });
    }

    /********************************************************************************************************* */

    const deleteUser = (id) => {

        Swal.fire({
            title: 'Deseja deletar o horario ?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: "#fa896b",
            confirmButtonColor: "#13deb9",
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Não, cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Envia os dados se o usuário confirmar
                axios.delete(`http://127.0.0.1:5000/hoursdelete/${id}`)
                    .then(response => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sucesso!',
                            text: 'Horario deletado com sucesso!',
                        }).then(() => {
                            // Recarrega a página após o usuário fechar o swal
                            window.location.reload();
                        });;
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: 'Houve um problema ao deletar o horario.',
                        });
                    });
            }
        });
    }

    /********************************************************************************************************* */
    const [hours, setHours] = useState([]);
    useEffect(() => {
        getHours();
    }, []);

    function getHours() {
        axios.get('http://127.0.0.1:5000/hourslist').then(function (response) {
            setHours(response.data);
        })
    }

    return (
        <div>
            <h5 className="card-title fw-semibold mb-4">Cadastro de Horarios</h5>
            <form >
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">* Horario De</label>
                    <input type="time" name="time_off" onChange={handleChange} value={inputs.time_off} className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">* Horario Até</label>
                    <input type="time" name="time_until" onChange={handleChange} value={inputs.time_until} className="form-control" id="exampleInputPassword1" />
                </div>
                <div>
                    <button type="button" onClick={handleSubmit} className="btn btn-success me-2">Cadastrar</button>
                    <button type="button" onClick={handleReset} className="btn btn-primary">Limpar</button>
                </div>
            </form>

            <div className='row mt-5 table-responsive'>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Horarios</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map((hour, key) =>
                            <tr key={key}>
                                <td scope="row">{hour.id}</td>
                                <td>{hour.time_off} | {hour.time_until}</td>
                                
                                <td>
                                    <button type="button" onClick={() => deleteUser(hour.id)} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Excluir" className="btn btn-outline-danger btn-sm me-1"><FontAwesomeIcon icon={faTrash} /></button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


