import { useSelector, useDispatch } from 'react-redux';
import {
  addContact,
  removeContact,
  changeFilter,
  getContacts,
  getFilter,
} from 'redux/contactsSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { nanoid } from 'nanoid';
import { FormAddContact } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import {
  Container,
  Card,
  Title,
  Accent,
  ContactsCard,
  ContactsTitle,
  SearchInput,
  DefaultText,
} from './App.styled';

export const App = () => {
  const contacts = useSelector(getContacts);
  const filter = useSelector(getFilter);
  const dispatch = useDispatch();

  const setContact = contact => {
    if (isDuplicate(contact)) {
      return toast.warn(
        `"${contact.name}: ${contact.number}" is already in contacts`
      );
    } else {
      toast.success('The contact has been successfully added');
      return dispatch(addContact({ id: nanoid(), ...contact }));
    }
  };

  const deleteContact = id => {
    dispatch(removeContact(id));
    toast.info('The contact has been successfully deleted');
  };

  const handleChangeFilter = e => {
    dispatch(changeFilter(e.target.value));
  };

  const isDuplicate = ({ name, number }) => {
    const result = contacts.find(
      item => item.name === name && item.number === number
    );
    return result;
  };

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }

    const normalizedFilter = filter.toLocaleLowerCase();
    const filteredContacts = contacts.filter(({ name, number }) => {
      const normalizedName = name.toLocaleLowerCase();
      const result =
        normalizedName.includes(normalizedFilter) ||
        number.includes(normalizedFilter);
      return result;
    });
    return filteredContacts;
  };

  const filteredContacts = getFilteredContacts();

  return (
    <Container>
      <Card>
        <Title>
          Phone<Accent>book</Accent>
        </Title>
        <FormAddContact onSubmit={setContact} />
      </Card>

      <ContactsCard>
        <ContactsTitle>Contacts</ContactsTitle>
        <SearchInput
          type="text"
          name="filter"
          onChange={handleChangeFilter}
          value={filter}
          placeholder="Search"
        />
        {contacts.length > 0 ? (
          <ContactList items={filteredContacts} removeContact={deleteContact} />
        ) : (
          <DefaultText>Contact list is empty</DefaultText>
        )}
      </ContactsCard>
      <ToastContainer autoClose={2000} theme="colored" />
    </Container>
  );
};
