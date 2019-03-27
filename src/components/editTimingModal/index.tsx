import * as React from 'react';
import Modal from 'react-modal';
import { TimesheetEntry } from '../../shared/types';
import './editTimingModal.css';
import { toISODate } from '../../shared/date';

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
        const { spentOn, comments, hours, activity } = this.props.data;
        const issue = this.props.data.issue || { id: 0, name: '---' };

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
                        <div className="col-25"><label htmlFor="date">Date</label></div>
                        <div className="col-75">
                            <input
                                disabled
                                type="date"
                                value={toISODate(spentOn)}
                                id="date"
                                name="date"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="issue">Issue</label></div>
                        <div className="col-75">
                            <select id="issue" name="issue" value={issue.id} disabled>
                                <option value={issue.id}>{issue.name}</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="hours">Hours</label></div>
                        <div className="col-75">
                            <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="8"
                                defaultValue={hours.toString()}
                                id="hours"
                                name="hours"
                                placeholder="Hours"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="comments">Comments</label></div>
                        <div className="col-75">
                            <textarea
                                id="comments"
                                name="comments"
                                placeholder="Describe what you did"
                                style={{ height: 200 }}
                                defaultValue={comments} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-25"><label htmlFor="activity">Activity</label></div>
                        <div className="col-75">
                            <select id="issue" name="issue" defaultValue={activity.id}>
                                <option value={activity.id}>{activity.name}</option>
                            </select>
                        </div>
                    </div>
                    <div className="row footer">
                        <button className="btn btn-primary" onClick={this.onSubmit.bind(this)}>Save</button>
                        <button className="btn" onClick={this.props.onClose}>Cancel</button>
                        <button className="btn btn-danger" style={{ float: 'left' }} onClick={this.onDelete.bind(this)}>Delete</button>
                    </div>
                </form>
            </Modal>
        );
    }
}