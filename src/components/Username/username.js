import React, { Component } from 'react';


class Username extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Email: '',
            Name: '',
        };
    }

    onEmailChange(event) {
        this.setState({ Email: event.target.value });
    }

    onPasswordChange(event) {
        this.setState({ Password: event.target.value });
    }

    onNameChange(event) {
        this.setState({ Name: event.target.value });
    }

    onSubmitSignIn = (e) => {
        e.preventDefault();
        if (this.state.Password !== this.state.ConfirmPassword) {
            this.setState({ passwordMatch: false });
            return;
        }
        fetch('http://localhost:3001/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                googleId: this.props.googleId,
                description: this.state.Email,
                username: this.state.Name
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(this.props.googleId);
                console.log(data);
                if (data) {
                    this.props.loadUser(data);
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    toggleShowPassword = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));
    };

    toggleShowConfirmPassword = () => {
        this.setState(prevState => ({
            showConfirmPassword: !prevState.showConfirmPassword,
        }));
    };

    render() {
        const { Email, Name } = this.state;
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        const isFormValid = Email.trim() !== '' && Name.trim() !== '';

        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://static.xx.fbcdn.net/rsrc.php/v3/yV/r/_8T3PbCSTRI.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900  dark:text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={this.onSubmitSignIn}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    autoComplete="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={this.onNameChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900  dark:text-white">
                                About
                            </label>
                            <div className="mt-2">
                                <input
                                    id="about"
                                    name="about"
                                    type="description"
                                    autoComplete="description"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={this.onEmailChange}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${isFormValid ? 'hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'cursor-not-allowed opacity-50'
                                    }`}
                                onClick={this.onSubmitSignIn}
                                disabled={!isFormValid}
                            >
                                Let's get started !
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}

export default Username;