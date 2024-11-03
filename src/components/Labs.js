import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import {faPenToSquare, faTrash} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


export default function Labs(){


    const [inputs, setInputs] = useState([]);

    const handleChange = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleReset = () => {
        setInputs({
            room: '',
            build: ''
        });
    }; 

    const handleSubmit = (event) => {        
        event.preventDefault();


        if(inputs[["room"]] == undefined || inputs[["build"]] == ''){
            Swal.fire({icon: 'warning',title: 'Atenção!',text: 'Todos os campos precisam ser preenchidos!'})
            return            
        }

        Swal.fire({
            title: 'Cadastrar laboratorio ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#13deb9",
            cancelButtonColor: "#fa896b",
            confirmButtonText: 'Sim, cadastrar!',
            cancelButtonText: 'Não, cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Envia os dados se o usuário confirmar
                axios.post('http://127.0.0.1:5000/labsaddnew', inputs)
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

    const deleteLabs = (id) =>{

        Swal.fire({
            title: 'Deseja deletar laboratorio ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#13deb9",
            cancelButtonColor: "#fa896b",
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Não, cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Envia os dados se o usuário confirmar
                axios.delete(`http://127.0.0.1:5000/labdeletenew/${id}`)   
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Laboratorio deletado com sucesso!',
                    }).then(() => {
                        // Recarrega a página após o usuário fechar o swal
                        window.location.reload();
                    });;
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Houve um problema ao deletar o laboratorio.',
                    });
                });
            }
        });
    }

    /********************************************************************************************************* */
    const [labs, setLabs] = useState([]);
    useEffect(() => {
        getLabs();
    }, []);

    function getLabs(){
        axios.get('http://127.0.0.1:5000/listlabsnew').then(function(response){
            setLabs(response.data);
        })
    }

   

    return (
        <div>
            <h5 className="card-title fw-semibold mb-4">Cadastro de Laboratorio</h5>
            <form > 
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">* Sala</label>
                    <input type="text" name="room" onChange={handleChange} value={inputs.room} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">* Predio</label>
                    <select className="form-control" onChange={handleChange} name="build">
                        <option value="">Escolha o Predio</option>
                        <option value="Fafil">Fafil</option>
                        <option value="Faeng">Faeng</option>
                        <option value="Predio Central">Predio Central</option>
                    </select>
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
                            <th scope="col">Sala</th>
                            <th scope="col">Predio</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.map((labs, key) =>
                            
                            <tr key={key}>
                                <td scope="row">{labs.id}</td>
                                <td>{labs.name}</td>
                                <td>{labs.build}</td>
                                <td>
                                    
                                    <button type="button" onClick={() => deleteLabs(labs.id)} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Excluir" className="btn btn-outline-danger btn-sm me-1"><FontAwesomeIcon icon={faTrash} /></button>
                                    
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


