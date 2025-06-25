import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Application_Master extends Component {

    constructor(props) {
        super(props);

        this.state = {
            applications: [],
            modalTitle: "",
            application_id: 0,
            name: "",
            block: 0,

            ApplicationIdFilter: "",
            NameFilter: "",
            applicationsWithoutFilter: []
        };
    }

    FilterFn() {
        const { ApplicationIdFilter, NameFilter } = this.state;

        const filteredData = this.state.applicationsWithoutFilter.filter(el =>
            el.application_id.toString().toLowerCase().includes(ApplicationIdFilter.toString().trim().toLowerCase()) &&
            el.name.toString().toLowerCase().includes(NameFilter.toString().trim().toLowerCase())
        );

        this.setState({ applications: filteredData });
    }

    sortResult(prop, asc) {
        const sortedData = this.state.applicationsWithoutFilter.sort((a, b) => {
            if (asc) {
                return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
            } else {
                return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
            }
        });

        this.setState({ applications: sortedData });
    }

    changeApplicationIdFilter = (e) => {
        this.setState({ ApplicationIdFilter: e.target.value }, () => this.FilterFn());
    }

    changeNameFilter = (e) => {
        this.setState({ NameFilter: e.target.value }, () => this.FilterFn());
    }

    refreshList() {
        fetch(variables.API_URL + 'Application_master')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    applications: data,
                    applicationsWithoutFilter: data
                });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    changeName = (e) => {
        this.setState({ name: e.target.value });
    }

    changeBlock = (e) => {
        this.setState({ block: parseInt(e.target.value) || 0 });
    }

    addClick() {
        this.setState({
            modalTitle: "Add Application",
            application_id: 0,
            name: "",
            block: 0
        });
    }

    editClick(app) {
        this.setState({
            modalTitle: "Edit Block",
            application_id: app.application_id,
            name: app.name,
            block: app.block
        });
    }

    createClick() {
        fetch(variables.API_URL + 'Application_master', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(result);
                this.refreshList();
            }, error => {
                alert('Failed');
            });
    }

    updateClick() {
        fetch(variables.API_URL + 'Application_master', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                application_id: this.state.application_id,
                block: this.state.block
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(result);
                this.refreshList();
            }, error => {
                alert('Failed');
            });
    }

    deleteClick(id) {
        if (window.confirm('Are you sure?')) {
            fetch(variables.API_URL + 'Application_master/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(result => {
                    alert(result);
                    this.refreshList();
                }, error => {
                    alert('Failed');
                });
        }
    }

    render() {
        const {
            applications,
            modalTitle,
            application_id,
            name,
            block
        } = this.state;

        return (
            <div>
                <button type="button"
                    className="btn btn-primary m-2 float-end"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.addClick()}>
                    Add Application
                </button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2"
                                        onChange={this.changeApplicationIdFilter}
                                        placeholder="Filter" />
                                    <button className="btn btn-light"
                                        onClick={() => this.sortResult('application_id', true)}>↓</button>
                                    <button className="btn btn-light"
                                        onClick={() => this.sortResult('application_id', false)}>↑</button>
                                </div>
                                Application ID
                            </th>
                            <th>
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2"
                                        onChange={this.changeNameFilter}
                                        placeholder="Filter" />
                                    <button className="btn btn-light"
                                        onClick={() => this.sortResult('name', true)}>↓</button>
                                    <button className="btn btn-light"
                                        onClick={() => this.sortResult('name', false)}>↑</button>
                                </div>
                                Name
                            </th>
                            <th>Block</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app =>
                            <tr key={app.application_id}>
                                <td>{app.application_id}</td>
                                <td>{app.name}</td>
                                <td>{app.block}</td>
                                <td>
                                    <button type="button"
                                        className="btn btn-light m-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(app)}>
                                        ✏️
                                    </button>
                                    <button type="button"
                                        className="btn btn-light m-1"
                                        onClick={() => this.deleteClick(app.application_id)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Modal */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {application_id === 0 ?
                                    <>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Name</span>
                                            <input type="text" className="form-control"
                                                value={name}
                                                onChange={this.changeName} />
                                        </div>
                                        <button type="button"
                                            className="btn btn-primary float-start"
                                            onClick={() => this.createClick()}>
                                            Create
                                        </button>
                                    </>
                                    :
                                    <>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Block</span>
                                            <input type="number" className="form-control"
                                                value={block}
                                                onChange={this.changeBlock} />
                                        </div>
                                        <button type="button"
                                            className="btn btn-primary float-start"
                                            onClick={() => this.updateClick()}>
                                            Update
                                        </button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
