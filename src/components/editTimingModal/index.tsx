import * as React from 'react';
import Modal from 'react-modal';
import { TimesheetEntry } from '../../shared/types';
import './editTimingModal.css';

export type EditTimingModalProps = {
    isOpened: boolean,
    onClose: () => void,
    onSubmit?: (form: TimesheetEntry) => void,
    onDelete?: (form: TimesheetEntry) => void,
    data: TimesheetEntry,
};

export class EditTimingModal extends React.Component<EditTimingModalProps> {

    private onSubmit() {
        if (this.props.onSubmit === undefined) {
            return;
        }

        this.props.onSubmit(this.props.data);
    }

    private onDelete() {
        if (this.props.onDelete === undefined) {
            return;
        }

        this.props.onDelete(this.props.data);
    }

    public render() {
        return (
            <Modal
                isOpen={this.props.isOpened}
                onRequestClose={this.props.onClose}
                contentLabel="Edit timing"
                className="edit-timing-modal"
            >
                <h2>Edit timing</h2>
                <form>
                    <div className="row">
                        <div className="col-25"><label htmlFor="fname">First Name</label></div>
                        <div className="col-75">
                            <input type="text" id="fname" name="firstname" placeholder="Your name.." />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="lname">Last Name</label></div>
                        <div className="col-75">
                            <input type="text" id="lname" name="lastname" placeholder="Your last name.." />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="country">Country</label></div>
                        <div className="col-75">
                            <select id="country" name="country">
                                <option value="australia">Australia</option>
                                <option value="canada">Canada</option>
                                <option value="usa">USA</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="subject">Subject</label></div>
                        <div className="col-75">
                            <textarea id="subject" name="subject" placeholder="Write something.." style={{ height: 200 }}></textarea>
                        </div>
                    </div>
                    <div className="row footer">
                        <button className="btn btn-danger" onClick={this.onDelete.bind(this)}>Delete</button>
                        <button className="btn btn-primary" onClick={this.onSubmit.bind(this)}>Save</button>
                        <button className="btn" onClick={this.props.onClose}>Cancel</button>
                    </div>
                </form>
            </Modal>
        );
    }
}