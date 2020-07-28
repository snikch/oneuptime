import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShouldRender from '../basic/ShouldRender';
import { FormLoader } from '../basic/Loader';
import { ValidateField, SHOULD_LOG_ANALYTICS } from '../../config';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { RenderTextArea } from '../basic/RenderTextArea';
import {
    setInvestigationNote,
    editIncidentMessageSwitch,
    setInternalNote,
} from '../../actions/incident';
import { closeModal } from '../../actions/modal';
import { bindActionCreators } from 'redux';
import { logEvent } from '../../analytics';
import { RenderField } from '../basic/RenderField';
import { RenderSelect } from '../basic/RenderSelect';
const selector = formValueSelector('NewIncidentMessage');

class NewIncidentMessage extends Component {
    validate = values => {
        const errors = {};
        if (!ValidateField.text(values[`content`])) {
            errors.name = 'Incident Message is required.';
        }
        if (!ValidateField.text(values[`incident_state`])) {
            errors.name = 'Incident State is required.';
        }
        if (
            values[`incident_state`] === 'others' &&
            !ValidateField.text(values[`custom_incident_state`])
        ) {
            errors.name = 'Custom Incident State is required.';
        }
        return errors;
    };
    cancelEdit = () => {
        this.props.editIncidentMessageSwitch(this.props.incidentMessage);
    };
    submitForm = values => {
        const thisObj = this;
        const postObj = {};
        postObj.content = values[`content`];
        postObj.incident_state =
            values[`incident_state`] === 'others'
                ? values[`custom_incident_state`]
                : values[`incident_state`];
        let mode = 'NEW';
        if (this.props.data.edit) {
            postObj.id = this.props.incidentMessage._id;
        } else {
            postObj.type = this.props.data.type;
            mode = 'EDIT';
        }

        if (this.props.data.type === 'investigation') {
            this.props
                .setInvestigationNote(
                    this.props.currentProject._id,
                    this.props.data.incident._id,
                    postObj
                )
                .then(
                    () => {
                        thisObj.props.reset();
                        if (SHOULD_LOG_ANALYTICS) {
                            logEvent(
                                `EVENT: DASHBOARD > PROJECT > MONITOR > INCIDENT > ${mode} INVESTIGATION MESSAGE`,
                                values
                            );
                        }
                    },
                    error => {
                        if (error && error.message) {
                            return error;
                        }
                    }
                );
        } else {
            this.props
                .setInternalNote(
                    this.props.currentProject._id,
                    this.props.data.incident._id,
                    postObj
                )
                .then(
                    () => {
                        thisObj.props.reset();
                        if (SHOULD_LOG_ANALYTICS) {
                            logEvent(
                                `EVENT: DASHBOARD > PROJECT > MONITOR > INCIDENT > ${mode} INVESTIGATION MESSAGE`,
                                values
                            );
                        }
                    },
                    error => {
                        if (error && error.message) {
                            return error;
                        }
                    }
                );
        }
    };
    handleKeyBoard = e => {
        const { closeModal } = this.props;
        const { createMessageModalId } = this.props.data;
        switch (e.key) {
            case 'Escape':
                return closeModal({
                    id: createMessageModalId,
                });
            default:
                return false;
        }
    };
    render() {
        const {
            handleSubmit,
            incidentMessageState,
            incident_state,
        } = this.props;
        const { edit, type, createMessageModalId } = this.props.data;
        return (
            <div
                onKeyDown={this.handleKeyBoard}
                className="ModalLayer-contents"
                tabIndex="-1"
                style={{ marginTop: '40px' }}
            >
                <div className="bs-BIM">
                    <div className="bs-Modal bs-Modal--large">
                        <div className="bs-Modal-header">
                            <div
                                className="bs-Modal-header-copy"
                                style={{
                                    marginBottom: '10px',
                                    marginTop: '10px',
                                }}
                            >
                                <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                    <span id="incidentTitleLabel">
                                        Add New Incident Note
                                    </span>
                                </span>
                            </div>
                        </div>
                        <form
                            id={`form-new-incident-${type}-message`}
                            onSubmit={handleSubmit(this.submitForm)}
                        >
                            <div className="bs-ContentSection-content Box-root Box-background--offset Box-divider--surface-bottom-1 Padding-horizontal--8 Padding-vertical--2">
                                <div>
                                    <div className="bs-Fieldset-wrapper Box-root Margin-bottom--2">
                                        <fieldset className="bs-Fieldset">
                                            <div className="bs-Fieldset-row">
                                                <label className="bs-Fieldset-label">
                                                    Incident State
                                                </label>
                                                <div className="bs-Fieldset-fields">
                                                    <Field
                                                        className="db-select-nw"
                                                        component={RenderSelect}
                                                        name="incident_state"
                                                        id="incident_state"
                                                        placeholder="Incident State"
                                                        disabled={false}
                                                        validate={
                                                            ValidateField.select
                                                        }
                                                        options={[
                                                            {
                                                                value:
                                                                    'investigating',
                                                                label:
                                                                    'Investigating',
                                                            },
                                                            {
                                                                value: 'update',
                                                                label: 'Update',
                                                            },
                                                            {
                                                                value: 'others',
                                                                label: 'Others',
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                            <ShouldRender
                                                if={incident_state === 'others'}
                                            >
                                                <div className="bs-Fieldset-row">
                                                    <label className="bs-Fieldset-label">
                                                        Custom Incident State
                                                    </label>
                                                    <div className="bs-Fieldset-fields">
                                                        <Field
                                                            className="db-BusinessSettings-input TextInput bs-TextInput"
                                                            component={
                                                                RenderField
                                                            }
                                                            type="text"
                                                            name={`custom_incident_state`}
                                                            id="custom_incident_state"
                                                            placeholder="Enter a custom incident state"
                                                            validate={
                                                                ValidateField.text
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </ShouldRender>
                                            <div className="bs-Fieldset-rows">
                                                <div className="bs-Fieldset-row">
                                                    <ShouldRender if={!edit}>
                                                        <label className="bs-Fieldset-label">
                                                            {`${type
                                                                .charAt(0)
                                                                .toUpperCase()}${type.slice(
                                                                1
                                                            )} Notes`}
                                                        </label>
                                                    </ShouldRender>
                                                    <ShouldRender if={edit}>
                                                        <label className="bs-Fieldset-label">
                                                            {`Update your ${type
                                                                .charAt(0)
                                                                .toUpperCase()}${type.slice(
                                                                1
                                                            )} Note`}
                                                        </label>
                                                    </ShouldRender>
                                                    <div className="bs-Fieldset-fields bs-Fieldset-fields--wide">
                                                        <Field
                                                            component={
                                                                RenderTextArea
                                                            }
                                                            type="text"
                                                            name={`content`}
                                                            id={`${
                                                                edit
                                                                    ? 'edit'
                                                                    : 'new'
                                                            }-${type}`}
                                                            className="bs-TextArea"
                                                            rows="2"
                                                            placeholder="Add a message to the thread"
                                                            validate={
                                                                ValidateField.text
                                                            }
                                                            style={``}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            <div className="bs-ContentSection-footer bs-ContentSection-content Box-root Box-background--white Flex-flex Flex-alignItems--center Flex-justifyContent--spaceBetween Padding-horizontal--20 Padding-vertical--12">
                                <div className="bs-Tail-copy">
                                    <div className="Box-root Flex-flex Flex-alignItems--stretch Flex-direction--row Flex-justifyContent--flexStart">
                                        <ShouldRender
                                            if={
                                                edit &&
                                                this.props.incidentMessageState
                                                    .edit.error
                                            }
                                        >
                                            <div className="Box-root Margin-right--8">
                                                <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                            </div>
                                            <div className="Box-root">
                                                <span style={{ color: 'red' }}>
                                                    {
                                                        this.props
                                                            .incidentMessageState
                                                            .edit.error
                                                    }
                                                </span>
                                            </div>
                                        </ShouldRender>
                                        <ShouldRender
                                            if={
                                                !edit &&
                                                this.props.incidentMessageState
                                                    .create.error
                                            }
                                        >
                                            <div className="Box-root Margin-right--8">
                                                <div className="Icon Icon--info Icon--color--red Icon--size--14 Box-root Flex-flex"></div>
                                            </div>
                                            <div className="Box-root">
                                                <span style={{ color: 'red' }}>
                                                    {
                                                        this.props
                                                            .incidentMessageState
                                                            .create.error
                                                    }
                                                </span>
                                            </div>
                                        </ShouldRender>
                                    </div>
                                </div>
                                <span className="db-SettingsForm-footerMessage"></span>
                                <ShouldRender if={!edit}>
                                    <div>
                                        <button
                                            className="bs-Button bs-DeprecatedButton"
                                            type="button"
                                            onClick={() => {
                                                closeModal({
                                                    id: createMessageModalId,
                                                });
                                            }}
                                        >
                                            <ShouldRender
                                                if={
                                                    !incidentMessageState.create
                                                        .requesting
                                                }
                                            >
                                                <span>Cancel</span>
                                            </ShouldRender>
                                            <ShouldRender
                                                if={
                                                    incidentMessageState.create
                                                        .requesting
                                                }
                                            >
                                                <FormLoader />
                                            </ShouldRender>
                                        </button>
                                        <button
                                            id={`${type}-addButton`}
                                            className="bs-Button bs-Button--blue"
                                            type="submit"
                                        >
                                            <ShouldRender
                                                if={
                                                    !incidentMessageState.create
                                                        .requesting
                                                }
                                            >
                                                <span>Save </span>
                                            </ShouldRender>

                                            <ShouldRender
                                                if={
                                                    incidentMessageState.create
                                                        .requesting
                                                }
                                            >
                                                <FormLoader />
                                            </ShouldRender>
                                        </button>
                                    </div>
                                </ShouldRender>
                                <ShouldRender if={edit}>
                                    <div>
                                        <button
                                            className="bs-Button"
                                            disabled={
                                                incidentMessageState.edit
                                                    .requesting
                                            }
                                            onClick={this.cancelEdit}
                                        >
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            id={`${type}-editButton`}
                                            className="bs-Button bs-Button--blue"
                                            type="submit"
                                        >
                                            <ShouldRender
                                                if={
                                                    !incidentMessageState.edit
                                                        .requesting
                                                }
                                            >
                                                <span>Update </span>
                                            </ShouldRender>

                                            <ShouldRender
                                                if={
                                                    incidentMessageState.edit
                                                        .requesting
                                                }
                                            >
                                                <FormLoader />
                                            </ShouldRender>
                                        </button>
                                    </div>
                                </ShouldRender>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            setInvestigationNote,
            editIncidentMessageSwitch,
            setInternalNote,
            closeModal,
        },
        dispatch
    );

const mapStateToProps = (state, ownProps) => {
    const content = selector(state, 'content');
    const incidentMessageState =
        ownProps.data.type === 'investigation'
            ? state.incident.investigationNotes
            : state.incident.internalNotes;
    const initialValues = {
        content: ownProps.data.incidentMessage
            ? ownProps.data.incidentMessage.content
            : '',
    };
    const currentProject = state.project.currentProject;
    // TODO if incident state is for an edit
    const incident_state = state.form[ownProps.data.formId]
        ? state.form[ownProps.data.formId].values
            ? state.form[ownProps.data.formId].values.incident_state
                ? state.form[ownProps.data.formId].values.incident_state
                : ''
            : ''
        : '';
    return {
        content,
        initialValues,
        incidentMessageState,
        currentProject,
        form: ownProps.data.formId,
        incident_state,
    };
};
NewIncidentMessage.displayName = 'NewIncidentMessage';
const NewIncidentMessageForm = new reduxForm({
    destroyOnUnmount: true,
    enableReinitialize: true,
})(NewIncidentMessage);
NewIncidentMessage.propTypes = {
    incident: PropTypes.object,
    incidentMessage: PropTypes.object,
    incidentMessageState: PropTypes.object,
    currentProject: PropTypes.object,
    data: PropTypes.object,
    setInvestigationNote: PropTypes.func,
    handleSubmit: PropTypes.func,
    edit: PropTypes.bool,
    type: PropTypes.string,
    editIncidentMessageSwitch: PropTypes.func,
    setInternalNote: PropTypes.func,
    closeModal: PropTypes.func,
    createMessageModalId: PropTypes.string,
    incident_state: PropTypes.string,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewIncidentMessageForm);
