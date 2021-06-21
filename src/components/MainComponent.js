import React, { Component } from 'react';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { postComment, postFeedback, fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        leaders: state.leaders,
        promotions: state.promotions
    };
}

const mapDispatchToProps = dispatch => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    postFeedback: (feedback) => dispatch(postFeedback(feedback)),
    fetchDishes: () => { dispatch(fetchDishes()) },
    resetFeedbackForm: () => { dispatch(actions.reset('feedback')) },
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders())
});

class Main extends Component {

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }

    onDishSelect(dishId) {
        this.setState({ selectedDish: dishId });
    }

    render() {

        const HomePage = () => {
            return (
                <Home
                    dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    dishesLoading={this.props.dishes.isLoading}
                    dishErrMess={this.props.dishes.errMess}
                    promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                    promoLoading={this.props.promotions.isLoading}
                    promoErrMess={this.props.promotions.errMess}
                    leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    leaderLoading={this.props.leaders.isLoading}
                    leaderErrMess={this.props.leaders.errMess}
                />
            );
        };

        const DishWithId = ({ match }) => {
            if (parseInt(match.params.dishId) <= 3) {
                return (
                    <Dishdetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                        isLoading={this.props.dishes.isLoading}
                        errMess={this.props.dishes.errMess}
                        comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
                        commentsErrMess={this.props.comments.errMess}
                        postComment={this.props.postComment}
                    />
                );
            }
            else {
                return (<Redirect to="/home" />);
                }
        };
                 
                return (
            <div>
                <Header />
                <TransitionGroup>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch location={this.props.location}>
                            <Route path='/home' component={HomePage} />
                            <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />} />
                            <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                            <Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
                            <Route exact path='/:dishId' component={DishWithId} />
                            <Redirect to="/home" />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
                <Footer />
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));