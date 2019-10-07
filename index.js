const App = () => {
  const [contacts, setContacts] = React.useState([]);
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [filter, setFilter] = React.useState("");
  const [filteredContacts, setFilteredContacts] = React.useState([]);

  React.useEffect(() => {
    fetch("./contacts.json")
      .then(resp => resp.json())
      .then(setContacts);
  }, []);

  React.useEffect(() => {
    const query = filter.toLowerCase();
    const filtered = contacts.filter(x =>
      x.displayName.toLowerCase().includes(query)
    );
    setFilteredContacts(filtered);
    setSelectedContact(filtered.length > 0 ? filtered[0] : null);
  }, [contacts, filter]);

  React.useEffect(() => {
    function keyHandler({ key }) {
      if (key !== "ArrowUp" && key !== "ArrowDown") {
        return;
      }

      let increment = key === "ArrowUp" ? -1 : 1;
      let newIndex = filteredContacts.indexOf(selectedContact) + increment;
      setSelectedContact(filteredContacts[newIndex]);
    }

    window.addEventListener("keyup", keyHandler);

    return () => {
      window.removeEventListener("keyup", keyHandler);
    };
  }, [filteredContacts, selectedContact, setSelectedContact]);

  return (
    <div>
      <h1 className="text-center">My Contacts</h1>

      <div className="contactsPage card">
        <div className="contactsSearchBar">
          <ContactsSearchBar filter={filter} onFilterChanged={setFilter} />
        </div>
        <div className="contactsList">
          <ContactsList
            contacts={filteredContacts}
            onContactSelected={setSelectedContact}
            selectedContact={selectedContact}
          />
        </div>
        <div className="contactDetails">
          {selectedContact == null ? (
            <div>Please select a contact</div>
          ) : (
            <ContactDetails contact={selectedContact} />
          )}
        </div>
      </div>
    </div>
  );
};

const ContactsSearchBar = ({ filter, onFilterChanged }) => (
  <input
    type="text"
    className="form-control"
    placeholder="Search Contacts"
    value={filter}
    onChange={evt => onFilterChanged(evt.currentTarget.value)}
  />
);

const ContactsList = ({ contacts, onContactSelected, selectedContact }) => (
  <ul className="list-group">
    {contacts.map(contact => (
      <li
        key={contact.id}
        className={`list-group-item list-group-item-action ${
          selectedContact === contact ? "active" : ""
        }`}
        onClick={() => onContactSelected(contact)}
      >
        <img alt={contact.displayName} src={contact.profileImageUrl} />
        <div>{contact.displayName}</div>
      </li>
    ))}
  </ul>
);

const ContactDetails = ({ contact }) => (
  <React.Fragment>
    <img
      alt={contact.displayName}
      src={contact.profileImageUrl}
      className="avatar img-thumbnail"
    />

    <h3 className="displayName">{contact.displayName}</h3>

    <div>
      <label>First Name</label>
      <span>{contact.firstName}</span>
    </div>
    <div>
      <label>Last Name</label>
      <span>{contact.lastName}</span>
    </div>
    <div>
      <label>Date of Birth</label>
      <span>{new Date(contact.dateOfBirth).toLocaleDateString()}</span>
    </div>
    <div>
      <label>Occupation</label>
      <span>{contact.occupation}</span>
    </div>
    <div>
      <label>Email</label>
      <span>{contact.emailAddress}</span>
    </div>
    <div>
      <label>Phone Number</label>
      <span>
        {contact.phoneNumber
          .replace(/\D+/g, "")
          .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
      </span>
    </div>
  </React.Fragment>
);

ReactDOM.render(<App />, document.getElementById("app"));
