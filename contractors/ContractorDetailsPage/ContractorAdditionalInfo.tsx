import React, { useState } from 'react';
import {
    Button, FlexRow, Panel, Text, LabeledInput, FlexCell, IconButton, TextInput, TextArea,
} from '@epam/loveship';
import { useMedia } from 'react-use';
import { editIcon, peopleLinkIcon, timeLinkIcon } from '../../../components';
import { showConfirmationModal } from '../../../components/modals/confirmationModal/ConfirmationModal';
import { getDate } from '../../../helpers/Helpers';
import { ContractorLinksIcons } from '../../../server/apiModels';
import * as models from '../../../server/models';
import css from './ContractorDetailsPage.module.scss';

interface ContractorAdditionalInfoProps {
    isEditAdditionalInfoMode: boolean;
    isValidEmail: boolean;
    setIsValidEmail: (isValid: boolean) => void;
    isSbc: boolean;
    isDelegate: boolean;
    onEditClick: () => void;
    onCancelClick: () => void;
    onSaveClick: (contactInfoEmail: string, note: string) => void;
    contractor: models.ProfileContractor;
    isUnsavedAdditionalInfo: boolean;
    setIsUnsavedAdditionalInfo: (isUnsaved: boolean) => void;
}

export const ContractorAdditionalInfo: React.FC<ContractorAdditionalInfoProps> = (props) => {
    const [email, setEmail] = useState(props.contractor.contactInfoEmail);
    const [note, setNote] = useState(props.contractor.note);
    const mobileView = useMedia('(max-width: 720px)');
    const isShowLinks = (props.contractor?.links && Object.keys(props.contractor.links).length) && !props.isDelegate;
    const onCancel = () => {
        if (props.isUnsavedAdditionalInfo) {
            showConfirmationModal('Warning!', () => <Text>The information wasn't saved. All your changes will be lost. Continue?</Text>)
                .then(() => {
                    setEmail(props.contractor.contactInfoEmail);
                    setNote(props.contractor.note);
                    props.setIsValidEmail(true);
                    props.setIsUnsavedAdditionalInfo(false);
                    props.onCancelClick();
                }).catch(() => {});
        } else {
            props.onCancelClick();
        }
    };

    const onChangeEmail = (newEmail: string) => {
        if (!props.isUnsavedAdditionalInfo) {
            props.setIsUnsavedAdditionalInfo(true);
        }
        setEmail(newEmail);
        if (!props.isValidEmail) {
            props.setIsValidEmail(true);
        }
    };

    const onChangeNote = (newNote: string) => {
        if (!props.isUnsavedAdditionalInfo) {
            props.setIsUnsavedAdditionalInfo(true);
        }
        setNote(newNote);
    };

    return (
        <Panel shadow background="white" cx={ css.additionalInfoContainerPanel }>
            <FlexRow borderBottom cx={ css.additionalInfoTitleRow }>
                <Text color="night700" font="sans-semibold">Contractor details</Text>
                {
                    !mobileView && (props.isEditAdditionalInfoMode ? (
                        <FlexRow>
                            <Button fill="none" color="night600" caption="Cancel" onClick={ onCancel } />
                            <Button color="grass" caption="Save" onClick={ () => props.onSaveClick(email, note) } />
                        </FlexRow>
                    ) : (
                        props.isSbc && <Button fill="none" color="night600" caption="Edit" icon={ editIcon } onClick={ props.onEditClick } />
                    ))
                }
            </FlexRow>
            <Panel cx={ css.additionalInfoPanel }>
                <FlexRow margin="12">
                    <FlexCell grow={ 1 }>
                        <LabeledInput cx={ css.additionalInfoLabel } label="Hire date">
                            <Text cx={ css.additionalInfoText } fontSize="14">{ props.contractor.hireDate ? getDate(props.contractor.hireDate) : '-' }</Text>
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <LabeledInput cx={ css.additionalInfoLabel } label="Country">
                            <Text cx={ css.additionalInfoText }>{ props.contractor.country || '-' }</Text>
                        </LabeledInput>
                    </FlexCell>
                    {!mobileView && (
                        <FlexCell grow={ 1 }>
                            <LabeledInput validationMessage="The email address is invalid" isInvalid={ !props.isValidEmail } cx={ css.additionalInfoLabel } label="Personal email">
                                {
                                    !props.isEditAdditionalInfoMode ? (
                                        <Text cx={ css.additionalInfoText }>{ props.contractor.contactInfoEmail || '-' }</Text>
                                    ) : (
                                        <TextInput
                                            isInvalid={ !props.isValidEmail }
                                            value={ email }
                                            onValueChange={ onChangeEmail }
                                            placeholder="Enter an email"
                                            maxLength={ 40 }
                                            autoFocus
                                        />
                                    )
                                }
                            </LabeledInput>
                        </FlexCell>
                    )}
                </FlexRow>
                <FlexRow margin="12">
                    <FlexCell grow={ 1 }>
                        <LabeledInput cx={ css.additionalInfoLabel } label="Termination date">
                            <Text cx={ css.additionalInfoText }>{ props.contractor.dismissalDate ? getDate(props.contractor.dismissalDate) : '-' }</Text>
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={ 1 }>
                        <LabeledInput cx={ css.additionalInfoLabel } label="City">
                            <Text cx={ css.additionalInfoText }>{ props.contractor.city || '-' }</Text>
                        </LabeledInput>
                    </FlexCell>
                    {!mobileView && (
                        <FlexCell grow={ 1 }>
                            <LabeledInput cx={ css.additionalInfoLabel } label="Notes">
                                {
                                    !props.isEditAdditionalInfoMode ? (
                                        <Text cx={ css.additionalInfoText }>{ props.contractor.note || '-' }</Text>
                                    ) : (
                                        <TextArea
                                            maxLength={ 500 }
                                            rows={ 1 }
                                            autoSize
                                            placeholder="Enter a note"
                                            value={ note }
                                            onValueChange={ onChangeNote }
                                            cx={ css.noteTextArea }
                                        />
                                    )
                                }
                            </LabeledInput>
                        </FlexCell>
                    )}
                </FlexRow>
                <FlexRow margin="12">
                    <FlexCell grow={ 1 }>
                        <LabeledInput cx={ css.additionalInfoLabel } label="Resource manager">
                            <Text cx={ css.additionalInfoText }>{ props.contractor.managerName || '-' }</Text>
                        </LabeledInput>
                    </FlexCell>
                    <FlexCell grow={ !mobileView ? 2 : 1 }>
                        {
                            isShowLinks ? (
                                <LabeledInput cx={ css.additionalInfoLabel } label="Links">
                                    <FlexRow>
                                        {
                                            props.contractor?.links[ContractorLinksIcons.time] && (
                                                <IconButton icon={ timeLinkIcon } onClick={ () => window.open(`${props.contractor?.links[ContractorLinksIcons.time]}`, '_blank') } />
                                            )
                                        }
                                        {
                                            props.contractor?.links[ContractorLinksIcons.people] && (
                                                <IconButton icon={ peopleLinkIcon } onClick={ () => window.open(`${props.contractor?.links[ContractorLinksIcons.people]}`, '_blank') } />
                                            )
                                        }
                                    </FlexRow>
                                </LabeledInput>
                            ) : null
                        }
                    </FlexCell>
                </FlexRow>
            </Panel>
        </Panel>
    );
};
