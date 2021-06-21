import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody, CardTitle,
    Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody,
    Row, Col, Label, Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        alert("Comment Submitted!" + JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.name, values.comment);
    }

    render() {
        return (
            <div>
                <div className="row row-content">
                    <div className="col-12">
                        <Button outline onClick={this.toggleModal}>
                            <span className="fa fa-lg fa-pencil"> Submit Comment</span>
                        </Button>
                    </div>
                </div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" sm={12}>Rating</Label>
                                <Col sm={12}>
                                    <Control.select model=".rating" name="rating"
                                        id="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="name" sm={12}>Your Name</Label>
                                <Col sm={12}>
                                    <Control.text model=".name" name="name"
                                        placeholder="Your Name"
                                        id="name"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                        className="form-control" />
                                    <Errors
                                        className="text-danger"
                                        model=".name"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" sm={12}>Comment</Label>
                                <Col sm={12}>
                                    <Control.textarea model=".comment" id="comment"
                                        rows="6"
                                        name="comment"
                                        validators={{
                                            required
                                        }}
                                        className="form-control" />
                                    <Errors
                                        className="text-danger"
                                        model=".comment"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col md={12}>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }

}

function RenderDish({ dish }) {
    if (dish != null)
        return (
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        );
    else
        return (
            <div></div>
         );
}

function RenderComments({ comments, postComment, dishId }) {
        if (comments) {
            const comment = comments.map((comment) => {
                return (
                    <div className="container">
                        <div className="row">
                            <ul className="list-unstyled"><Fade in><li key="comment.id"><p>{comment.comment}</p>
                                <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p></li>
                                </Fade>
                            </ul>
                        </div>
                    </div>
                    );
            });
            return (
                <div className="container">
                <h4>Comments</h4>
                <Stagger in>
                    {comment}
                </Stagger>
                <CommentForm dishId={dishId} postComment={postComment} />                </div>
                ); 
        }
        else {
            return (<div></div>);
        }
    }

const Dishdetail = (props) => {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-2">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-2">
                        <RenderComments comments={props.comments}
                            postComment={props.postComment}
                            dishId={props.dish.id}
                        />
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (<div></div>);
    }
}
        
    


export default Dishdetail;