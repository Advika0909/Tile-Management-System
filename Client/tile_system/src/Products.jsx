import React, { Component } from 'react';
import { variables } from './Variables';

export class Products_Master extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            modalTitle: "",
            prod_id: 0,
            category_id: "",
            application_id: "",
            prod_name: "",
            sqcode: "",
            block: 0
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList() {
        fetch(variables.API_URL + "Product")
            .then(response => response.json())
            .then(data => {
                this.setState({ products: data });
            });
    }

    changeCategoryId = (e) => {
        this.setState({ category_id: e.target.value });
    }

    changeApplicationId = (e) => {
        this.setState({ application_id: e.target.value });
    }

    changeProdName = (e) => {
        this.setState({ prod_name: e.target.value });
    }

    changeSqcode = (e) => {
        this.setState({ sqcode: e.target.value });
    }

    changeBlock = (e) => {
        this.setState({ block: parseInt(e.target.value) || 0 });
    }

    addClick() {
        this.setState({
            modalTitle: "Add Product",
            prod_id: 0,
            category_id: "",
            application_id: "",
            prod_name: "",
            sqcode: "",
            block: 0
        });
    }

    editClick(prod) {
        this.setState({
            modalTitle: "Edit Block",
            prod_id: prod.prod_id,
            block: prod.block
        });
    }

    createClick() {
        fetch(variables.API_URL + "Product", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_id: parseInt(this.state.category_id),
                application_id: parseInt(this.state.application_id),
                prod_name: this.state.prod_name,
                sqcode: this.state.sqcode
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(result);
                this.refreshList();
            }, error => {
                alert("Failed");
            });
    }

    updateClick() {
        fetch(variables.API_URL + "Product", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prod_id: this.state.prod_id,
                block: this.state.block
            })
        })
            .then(res => res.json())
            .then(result => {
                alert(result);
                this.refreshList();
            }, error => {
                alert("Failed");
            });
    }

    deleteClick(id) {
        if (window.confirm("Are you sure?")) {
            fetch(variables.API_URL + "Product/" + id, {
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
                    alert("Failed");
                });
        }
    }

    render() {
        const {
            products,
            modalTitle,
            prod_id,
            category_id,
            application_id,
            prod_name,
            sqcode,
            block
        } = this.state;

        return (
            <div>
                <button type="button"
                    className="btn btn-primary m-2 float-end"
                    data-bs-toggle="modal"
                    data-bs-target="#productModal"
                    onClick={() => this.addClick()}>
                    Add Product
                </button>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Category ID</th>
                            <th>Application ID</th>
                            <th>Sqcode</th>
                            <th>Block</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(prod =>
                            <tr key={prod.prod_id}>
                                <td>{prod.prod_id}</td>
                                <td>{prod.prod_name}</td>
                                <td>{prod.category_id}</td>
                                <td>{prod.application_id}</td>
                                <td>{prod.sqcode}</td>
                                <td>{prod.block}</td>
                                <td>
                                    <button type="button"
                                        className="btn btn-light m-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#productModal"
                                        onClick={() => this.editClick(prod)}>
                                        ✏️
                                    </button>
                                    <button type="button"
                                        className="btn btn-danger m-1"
                                        onClick={() => this.deleteClick(prod.prod_id)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Modal */}
                <div className="modal fade" id="productModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {prod_id === 0 ?
                                    <>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Category ID</span>
                                            <input type="number" className="form-control"
                                                value={category_id}
                                                onChange={this.changeCategoryId} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Application ID</span>
                                            <input type="number" className="form-control"
                                                value={application_id}
                                                onChange={this.changeApplicationId} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Product Name</span>
                                            <input type="text" className="form-control"
                                                value={prod_name}
                                                onChange={this.changeProdName} />
                                        </div>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">Sqcode</span>
                                            <input type="text" className="form-control"
                                                value={sqcode}
                                                onChange={this.changeSqcode} />
                                        </div>
                                        <button type="button"
                                            className="btn btn-primary float-end"
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
                                            className="btn btn-primary float-end"
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
