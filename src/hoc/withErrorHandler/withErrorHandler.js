import React from 'react';
import axios from 'axios';
import Modal from '../../components/UI/Modal/Modal';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent) => {
    return props => {
        const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

        return (
            <React.Fragment>
                <Modal show={error}
                    backdropClicked={errorConfirmedHandler}>
                    {error}
                </Modal>
                <WrappedComponent {...props} />
            </React.Fragment>
        );
    }
}

export default withErrorHandler;

