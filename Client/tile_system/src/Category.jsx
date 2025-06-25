import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Category_Master extends Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            modalTitle: "",
            category_id: 0,
            name: "",
            block: 0,

            CategoryIdFilter: "",
            NameFilter: "",
            categoriesWithoutFilter: []
        };
    }

    FilterFn() {
        const { CategoryIdFilter, NameFilter } = this.state;

        const filteredData = this.state.categoriesWithoutFilter.filter(el =>
            el.category_id.toString().toLowerCase().includes(CategoryIdFilter.toString().trim().toLowerCase()) &&
            el.name.toString().toLowerCase().includes(NameFilter.toString().trim().toLowerCase())
        );

        this.setState({ categories: filteredData });
    }

    sortResult(prop, asc) {
        const sortedData = this.state.categoriesWithoutFilter.sort((a, b) => {
            if (asc) {
                return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
            } else {
                return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
            }
        });

        this.setState({ categories: sortedData });
    }

    changeCategoryIdFilter = (e) => {
        this.setState({ CategoryIdFilter: e.target.value }, () => this.FilterFn());
    }

    changeNameFilter = (e) => {
        this.setState({ NameFilter: e.target.value }, () => this.FilterFn());
    }

    refreshList() {
        fetch(variables.API_URL + 'Category')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    categories: data,
                    categoriesWithoutFilter: data
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
            modalTitle: "Add Category",
            category_id: 0,
            name: "",
            block: 0
        });
    }

    editClick(cat) {
        this.setState({
            modalTitle: "Edit Block",
            category_id: cat.category_id,
            name: cat.name,
            block: cat.block
        });
    }

    createClick() {
        fetch(variables.API_URL + 'Category', {
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
        fetch(variables.API_URL + 'Category', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_id: this.state.category_id,
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
            fetch(variables.API_URL + 'Category/' + id, {
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
            categories,
            modalTitle,
            category_id,
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
                    Add Category
                </button>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>
                                <div className="d-flex flex-row">
                                    <input className="form-control m-2"
                                        onChange={this.changeCategoryIdFilter}
                                        placeholder="Filter" />
                                    <button className="btn btn-light"
                                        onClick={() => this.sortResult('category_id', true)}>↓</button>
                                    <button className="btn btn-light"
                                        onClick={() => this.sortResult('category_id', false)}>↑</button>
                                </div>
                                Category ID
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
                        {categories.map(cat =>
                            <tr key={cat.category_id}>
                                <td>{cat.category_id}</td>
                                <td>{cat.name}</td>
                                <td>{cat.block}</td>
                                <td>
                                    <button type="button"
                                        className="btn btn-light m-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                        onClick={() => this.editClick(cat)}>
                                        ✏️
                                    </button>
                                    <button type="button"
                                        className="btn btn-light m-1"
                                        onClick={() => this.deleteClick(cat.category_id)}>
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
                                {category_id === 0 ?
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
