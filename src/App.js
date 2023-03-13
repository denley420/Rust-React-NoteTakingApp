import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import NotesList from "./components/NotesList";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { idl } from "./components/idl";
import Search from "./components/Search";
import Header from "./components/Header";

const App = () => {
  const AnchorWallet = useAnchorWallet();
  const [program, setProgram] = useState();
  async function initProgram() {
    // Connect to network
    const network = "https://api.devnet.solana.com"
    const connection = new Connection(network, "processed")
    const provider = new AnchorProvider(connection, AnchorWallet, {
      preflightCommitment: "processed"
    })
    // Connect to program
    const program = new Program(idl, idl.metadata.address, provider)
    setProgram(program);
    console.log("Done initProgram " + idl.metadata.address);
    return program;
  }
  async function startProgram(text) {
    let note = web3.Keypair.generate();
    await program.methods
      .createNote(
        text
      )
      .accounts({
        note: note.publicKey,
        user: AnchorWallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([note])
      .rpc();
    console.log(note)
    localStorage.setItem("note", JSON.stringify(note));
  }
  async function fetchNote(program) {
    try {
      console.log(Uint8Array.from(Object.values(
        JSON.parse(
          localStorage.getItem(("note"))
        )
          ._keypair
          .secretKey
      )
      )
      )
      // Calculate the PDA address
      const noteAddress = web3.Keypair.fromSecretKey(
        Uint8Array.from(
          Object.values(
            JSON.parse(
              localStorage.getItem(("note"))
            )
              ._keypair
              .secretKey
          )
        )
      );

      console.log(program.account)
      let dat_1 = await program.account.note.fetch(noteAddress.publicKey);
      console.log(dat_1)
      return dat_1;

      // Console log current notes
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  const [notes, setNotes] = useState([
    {
      id: nanoid(),
      text: "This is my first note",
      date: "01/27/2023"
    },
    {
      id: nanoid(),
      text: "This is my second note",
      date: "01/29/2023"
    },
    {
      id: nanoid(),
      text: "This is my third note",
      date: "01/30/2023"
    }
  ]);

  const [searchText, setSearchText] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(
      localStorage.getItem("react-notes-app-data")
    );
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "react-notes-app-data",
      JSON.stringify(notes)
    )
  }, [notes]);

  const addNote = async (text) => {
    const date = new Date();
    const newNote = {
      id: nanoid(),
      text: text,
      date: date.toLocaleDateString()
    }
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    await startProgram(text);
  }

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  }
  const [firstRun, setFirstRun] = useState(true);
  useEffect(() => {
    (async () => {
      if (AnchorWallet && firstRun) {
        setFirstRun(false);
        const program = await initProgram();
        setTimeout(async () => {
          let note = await fetchNote(program)
          addNote(note.content);
        }, 2000);
      }
    })()

  }, [AnchorWallet])

  return (
    <div className={`${darkMode && "dark-mode"}`}>
      <div className="container">
        <Header handleToggleDarkMode={setDarkMode} />
        <div className="btn-container">
          <WalletMultiButton></WalletMultiButton>
          <button className="fetch-note" onClick={fetchNote}>Fetch Note</button>
        </div>
        <Search handleSearchNote={setSearchText} />
        <NotesList
          notes={notes.filter((note) =>
            note.text.toLowerCase().includes(searchText)
          )}
          handleAddNote={addNote}
          handleDeleteNote={deleteNote}
        />
      </div>
    </div>

  );
}

export default App;