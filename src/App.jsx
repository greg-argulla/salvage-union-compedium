/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import OBR from "@owlbear-rodeo/sdk";
import ChatComponent from "./ChatComponent";
import "./App.css";

/* Data */
import classEngineer from "./data/classEngineer.json";
import classHacker from "./data/classHacker.json";
import classHauler from "./data/classHauler.json";
import classScout from "./data/classScout.json";
import classSoldier from "./data/classSoldier.json";

import hybridCyborg from "./data/hybridCyborg.json";
import hybridFabricator from "./data/hybridFabricator.json";
import hybridRanger from "./data/hybridRanger.json";
import hybridSmuggler from "./data/hybridSmuggler.json";
import hybridUnionRep from "./data/hybridUnionRep.json";

import chassisT1 from "./data/chassisT1.json";
import chassisT2 from "./data/chassisT2.json";
import chassisT3 from "./data/chassisT3.json";
import chassisT4 from "./data/chassisT4.json";
import chassisT5 from "./data/chassisT5.json";
import chassisT6 from "./data/chassisT6.json";

import systemsT1 from "./data/systemsT1.json";
import systemsT2 from "./data/systemsT2.json";
import systemsT3 from "./data/systemsT3.json";
import systemsT4 from "./data/systemsT4.json";
import systemsT5 from "./data/systemsT5.json";
import systemsT6 from "./data/systemsT6.json";

import modulesT1 from "./data/modulesT1.json";
import modulesT2 from "./data/modulesT2.json";
import modulesT3 from "./data/modulesT3.json";
import modulesT4 from "./data/modulesT4.json";
import modulesT5 from "./data/modulesT5.json";
import modulesT6 from "./data/modulesT6.json";

import equipmentT1 from "./data/equipmentT1.json";
import equipmentT2 from "./data/equipmentT2.json";
import equipmentT3 from "./data/equipmentT3.json";
import equipmentT4 from "./data/equipmentT4.json";
import equipmentT5 from "./data/equipmentT5.json";
import equipmentT6 from "./data/equipmentT6.json";

import traits from "./data/traits.json";
import keywords from "./data/keywords.json";

// GM data
import names from "./gm/names.json";
import location from "./gm/locations.json";

const Text = (props) => {
  const { children } = props;
  return <span className="outline">{children}</span>;
};

const collection = [
  "Classes",
  classEngineer,
  classHacker,
  classHauler,
  classScout,
  classSoldier,
  "Hybrid Classes",
  hybridCyborg,
  hybridFabricator,
  hybridRanger,
  hybridSmuggler,
  hybridUnionRep,
  "Chassis",
  chassisT1,
  chassisT2,
  chassisT3,
  chassisT4,
  chassisT5,
  chassisT6,
  "Systems",
  systemsT1,
  systemsT2,
  systemsT3,
  systemsT4,
  systemsT5,
  systemsT6,
  "Modules",
  modulesT1,
  modulesT2,
  modulesT3,
  modulesT4,
  modulesT5,
  modulesT6,
  "Equipment",
  equipmentT1,
  equipmentT2,
  equipmentT3,
  equipmentT4,
  equipmentT5,
  equipmentT6,
  "Other",
  traits,
  keywords,
];

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [role, setRole] = useState("PLAYER");

  const [isOBRReady, setIsOBRReady] = useState(false);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();
          if (metadata["salvage.union.character/metadata"]) {
            const playerListGet = await createPlayerList(metadata);

            // download(
            //   JSON.stringify(playerListGet),
            //   "salvage-union.txt",
            //   "text/plain"
            // );

            setPlayerList(playerListGet);
          }
          setRole(await OBR.player.getRole());
          setIsOBRReady(true);
        } else {
          setIsOBRReady(false);
        }
      });

      if (await OBR.scene.isReady()) {
        const metadata = await OBR.scene.getMetadata();
        if (metadata["salvage.union.character/metadata"]) {
          const playerListGet = await createPlayerList(metadata);
          setPlayerList(playerListGet);
        }
        setRole(await OBR.player.getRole());
        setIsOBRReady(true);
      }
    });
  }, []);

  const createPlayerList = async (metadata) => {
    const metadataGet = metadata["salvage.union.character/metadata"];
    const playerListGet = [];
    const keys = Object.keys(metadataGet);
    keys.forEach((key) => {
      playerListGet.push(metadataGet[key]);
    });
    return playerListGet;
  };

  useEffect(() => {
    if (isOBRReady) {
      OBR.scene.onMetadataChange(async (metadata) => {
        const playerListGet = await createPlayerList(metadata);
        setPlayerList(playerListGet);
      });

      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          const metadata = await OBR.scene.getMetadata();
          if (metadata["salvage.union.character/metadata"]) {
            const playerListGet = await createPlayerList(metadata);
            setPlayerList(playerListGet);
          }
          setRole(await OBR.player.getRole());
        }
      });
    }
  }, [isOBRReady]);

  const sendSkill = (skill) => {
    const skillData = {
      skillName: skill.name ? skill.name : "Blank skill",
      info: skill.info,
      detail: skill.detail,
      characterName: "Compedium",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "salvage.union.character/sendskill": skillData,
    });
    showMessage("Skill Info Sent!");
  };

  useEffect(() => {
    OBR.onReady(async () => {
      OBR.scene.onReadyChange(async (ready) => {
        if (ready) {
          setName(await OBR.player.getName());
          setId(await OBR.player.getId());

          OBR.player.onChange(async (player) => {
            setName(await OBR.player.getName());
          });
        }
      });

      if (await OBR.scene.isReady()) {
        setName(await OBR.player.getName());
        setId(await OBR.player.getId());

        OBR.player.onChange(async (player) => {
          setName(await OBR.player.getName());
        });
      }
    });
  }, []);

  const showMessage = (messageGet) => {
    setMessage(messageGet);

    setTimeout(() => {
      setMessage("");
    }, 1000);
  };

  const parseQuote = (str) => {
    const split = str.split("`");

    return split.map((item, index) => {
      if (index % 2 !== 0) {
        return (
          <span key={"parseTilde" + index} style={{ color: "moccasin" }}>
            {item}
          </span>
        );
      }
      return <span key={"parseTilde" + index}>{item}</span>;
    });
  };

  const parseAsterisk = (str) => {
    const split = str.split("*");

    return split.map((item, index) => {
      if (index % 2 !== 0) {
        return (
          <span key={"parseAsterisk" + index} style={{ color: "red" }}>
            {item}
          </span>
        );
      }
      return <span key={"parseAsterisk" + index}>{parseQuote(item)}</span>;
    });
  };

  const parseDetail = (str) => {
    if (str === undefined) return "";
    const detailSplit = str.split("\n");
    return detailSplit.map((item, index) => {
      if (item === "") return <div key={"parseDetail" + index}>&#8205;</div>;

      return <div key={"parseDetail" + index}>{parseAsterisk(item)}</div>;
    });
  };

  const copyToClipboard = (info, string) => {
    navigator.clipboard.writeText(string);
    setMessage("Copied " + info + " to clipboard.");
    setTimeout(() => {
      setMessage("");
    }, 1500);
  };

  const skillInstance = (item, index, found) => {
    const categorySearched =
      searchItems === "" ||
      found ||
      JSON.stringify(item).toLowerCase().includes(searchItems.toLowerCase());

    if (!categorySearched) return "";
    return (
      <div
        key={"skillInstance" + index}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        <div className="skill-detail">
          <div
            style={{
              fontSize: 13,
              color: "darkorange",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{ cursor: "copy" }}
                onClick={() => {
                  copyToClipboard("name", item.name);
                }}
              >
                {item.name}
              </div>
              {item.info ? (
                <div
                  style={{ color: "darkgrey", cursor: "copy", fontSize: 10 }}
                  onClick={() => {
                    copyToClipboard("info", item.info);
                  }}
                >
                  {item.info}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <button
                className="button"
                style={{
                  float: "right",
                  font: 10,
                  padding: 4,
                  marginLeft: 4,
                }}
                onClick={() => {
                  sendSkill(item);
                }}
              >
                Send
              </button>
            </div>
          </div>

          <hr
            style={{
              marginTop: 6,
              marginBottom: 6,
              borderColor: "grey",
              backgroundColor: "grey",
              color: "grey",
            }}
          ></hr>
          <div
            style={{ cursor: "copy" }}
            onClick={() => {
              copyToClipboard("detail", item.detail);
            }}
          >
            {parseDetail(item.detail)}
          </div>
        </div>
      </div>
    );
  };

  const tableInstance = (item, index, found) => {
    const categorySearched =
      searchItems === "" ||
      found ||
      JSON.stringify(item).toLowerCase().includes(searchItems.toLowerCase());

    if (!categorySearched) return "";

    const table = item.table;
    return (
      <>
        <span
          className="outline"
          style={{
            fontSize: 13,
            marginRight: 5,
            cursor: "copy",
          }}
          onClick={() => {
            copyToClipboard("category name", item.name);
          }}
        >
          {item.name}
        </span>
        <table
          style={{
            border: "1px solid #555",
            borderCollapse: "collapse",
            marginBottom: 10,
            backgroundColor: "#222",
          }}
        >
          <tbody>
            {table.map((row, index) => (
              <tr
                key={"tr" + index}
                style={{
                  border: "1px solid #555",
                  borderCollapse: "collapse",
                }}
              >
                {row.map((column) => (
                  <td
                    key={column}
                    className="outline"
                    style={{
                      fontSize: 10,
                      color: index === 0 ? "darkorange" : "#fff",
                      border: "1px solid #555",
                      borderCollapse: "collapse",
                      textAlign: "center",
                      padding: 4,
                      cursor: "copy",
                    }}
                    onClick={() => {
                      let toSend = "";
                      row.forEach((element) => {
                        if (toSend === "") {
                          toSend = element;
                        } else {
                          toSend += " - " + element;
                        }
                      });
                      copyToClipboard("row", toSend);
                    }}
                  >
                    {parseDetail(column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const [searchItems, setSearchItems] = useState("");

  const category = (item, index, found) => {
    const categorySearched =
      searchItems === "" ||
      found ||
      JSON.stringify(item).toLowerCase().includes(searchItems.toLowerCase());

    const nameSearched =
      found || item.name.toLowerCase().includes(searchItems.toLowerCase());
    if (!categorySearched) return "";

    return (
      <div style={{ marginBottom: 20 }} key={"category" + index}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            marginLeft: 2,
          }}
        >
          <span
            className="outline"
            style={{
              fontSize: 16,
              color: "red",
              marginRight: 5,
              cursor: "copy",
            }}
            onClick={() => {
              copyToClipboard("category name", item.name);
            }}
          >
            {item.name}
          </span>
          <span
            className="outline"
            style={{ fontSize: 11, cursor: "copy" }}
            onClick={() => {
              copyToClipboard("category info", item.info);
            }}
          >
            {item.info}
          </span>
        </div>
        <hr
          style={{
            marginBottom: 8,
            borderColor: "#666",
            backgroundColor: "#666",
            color: "#666",
          }}
        ></hr>
        {item.data &&
          item.data.map((itemGet, indexGet) => {
            if (itemGet.detail) {
              return skillInstance(itemGet, indexGet, nameSearched);
            }
            if (itemGet.table) {
              return tableInstance(itemGet, indexGet, nameSearched);
            }
            if (itemGet.data) {
              const categorySearchedTwo =
                searchItems === "" ||
                nameSearched ||
                JSON.stringify(itemGet)
                  .toLowerCase()
                  .includes(searchItems.toLowerCase());

              if (!categorySearchedTwo) return "";

              return (
                <div
                  key={index + "categoryChild" + indexGet}
                  style={{
                    background: "rgba(0, 0, 0, .2)",
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    marginBottom: 10,
                    border: "1px solid #222",
                  }}
                >
                  {category(itemGet, indexGet, nameSearched)}
                </div>
              );
            }
            return "";
          })}
      </div>
    );
  };

  const renderCategory = () => {
    return (
      <div>
        {collection.map((item, index) => {
          if (typeof item === "string") {
            return "";
          }
          if (selectedCategory === "" || selectedCategory === item.name) {
            return category(item, index + "");
          }
          return "";
        })}
      </div>
    );
  };

  const renderClasses = () => {
    return (
      <>
        {role === "GM" && (
          <button
            className="button"
            style={{
              fontWeight: "bolder",
              width: 100,
              marginBottom: 4,
              color: selectedCategory === "GM" ? "white" : "orange",
              backgroundColor: selectedCategory === "GM" ? "darkred" : "#222",
            }}
            onClick={() => {
              setSelectedCategory("GM");
            }}
          >
            GM Helper
          </button>
        )}

        {collection.map((item, index) => {
          if (typeof item === "string") {
            return (
              <div
                className="outline"
                key={"renderClasses" + index}
                style={{ textAlign: "center" }}
              >
                {item}
              </div>
            );
          }

          return (
            <button
              key={"renderClasses" + index}
              className="button"
              style={{
                fontWeight: "bolder",
                width: 100,
                marginBottom: 4,
                color: selectedCategory === item.name ? "white" : "#ffd433",
                backgroundColor:
                  selectedCategory === item.name ? "darkred" : "#222",
              }}
              onClick={() => {
                if (selectedCategory !== item.name) {
                  setSelectedCategory(item.name);
                } else setSelectedCategory("");
              }}
            >
              {item.name}
            </button>
          );
        })}
      </>
    );
  };

  const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max);
  };

  const sendChance = (chance) => {
    const numResult = Math.floor(Math.random() * 100 + 1);

    const result = {};

    if (numResult <= chance.exceptionalYes) {
      result.title = "Exceptional Yes";
      result.message = `*Yes, it definitely is!* Beyond what is expected!\nRolled a \`${numResult}\` on a ${chance.chance} out of 100 \`${chance.name}\` chance`;
    } else if (numResult <= chance.chance) {
      result.title = "Yes";
      result.message = `Yes, it is!\nRolled a \`${numResult}\` on a ${chance.chance} out of 100 \`${chance.name}\` chance`;
    } else if (numResult >= chance.exceptionalNo) {
      result.title = "Exceptional No";
      result.message = `*No, its definitely not!* Completely oppposite of what's expected!\nRolled a \`${numResult}\` on a ${chance.chance} out of a 100 \`${chance.name}\` chance`;
    } else {
      result.title = "No!";
      result.message = `No, its not!\nRolled a \`${numResult}\` on a ${chance.chance} out of 100 \`${chance.name}\` chance`;
    }

    const skillData = {
      skillName: result.title,
      info: '"The Oracle of Fate have spoken."',
      detail: result.message,
      characterName: "Fate Oracle",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "salvage.union.character/sendskill": skillData,
    });
    showMessage("Sent Fate Roll!");
  };

  const chances = [
    { name: "Certain", chance: 90, exceptionalYes: 18, exceptionalNo: 99 },
    { name: "Near Certain", chance: 85, exceptionalYes: 17, exceptionalNo: 98 },
    { name: "Very Likely", chance: 75, exceptionalYes: 15, exceptionalNo: 96 },
    { name: "Likely", chance: 65, exceptionalYes: 13, exceptionalNo: 94 },
    { name: "50/50", chance: 50, exceptionalYes: 10, exceptionalNo: 91 },
    { name: "Unlikely", chance: 35, exceptionalYes: 7, exceptionalNo: 88 },
    { name: "Very Unlikely", chance: 25, exceptionalYes: 5, exceptionalNo: 86 },
    {
      name: "Near Impossible",
      chance: 15,
      exceptionalYes: 3,
      exceptionalNo: 84,
    },
    { name: "Impossible", chance: 10, exceptionalYes: 2, exceptionalNo: 83 },
  ];

  const sendRandomPlayer = (forGood) => {
    console.log(playerList);
    const playerListFiltered = playerList.filter((item) => !item.isGMPlayer);
    const numResult = Math.floor(Math.random() * playerListFiltered.length);

    const playerSelected = playerListFiltered[numResult];

    const skillData = {
      skillName: forGood
        ? playerSelected.details.callsign + " has been selected!"
        : playerSelected.details.callsign + " has been targeted!",
      info: "",
      detail: forGood
        ? '"Fate has chosen you."'
        : '"Brace yourself, this might hurt!"',
      characterName: "Random Player",
      userId: id,
      username: name,
      id: Date.now(),
    };
    OBR.room.setMetadata({
      "salvage.union.character/sendskill": skillData,
    });
    showMessage("Sent Random Adversary!");
  };

  const [randomNumbersGenerated, setRandomNumbers] = useState([
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(names.length),
    getRandomNumber(location.length),
    getRandomNumber(location.length),
    getRandomNumber(location.length),
    getRandomNumber(location.length),
  ]);

  const generateNewRandom = () => {
    setRandomNumbers([
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(names.length),
      getRandomNumber(location.length),
      getRandomNumber(location.length),
      getRandomNumber(location.length),
    ]);
  };

  const renderGM = () => {
    return (
      <>
        <div
          className="outline"
          style={{
            fontSize: 16,
            color: "red",
            marginRight: 5,
          }}
        >
          GM Helper
        </div>
        <hr
          style={{
            marginBottom: 8,
            borderColor: "#666",
            backgroundColor: "#666",
            color: "#666",
          }}
        ></hr>
        <div
          style={{
            background: "rgba(0, 0, 0, .2)",
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 10,
            border: "1px solid #222",
          }}
        >
          {import.meta.env.VITE_SECRET_KEY && <ChatComponent />}
          <div className="outline" style={{ color: "orange" }}>
            Fate Question: Would it happen? (Click how likely it will happen)
          </div>
          <hr></hr>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {chances.map((item) => (
              <button
                className="button"
                style={{
                  width: 100,
                  marginBottom: 4,
                }}
                onClick={() => {
                  sendChance(item);
                }}
                title={`Chance: ${item.chance}%`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="outline" style={{ color: "#BBB" }}>
            Tip: Hover to see what are the odds
          </div>
          <hr></hr>
          <div className="outline" style={{ color: "orange" }}>
            Pick Random Target:
          </div>
          <button
            className="button"
            style={{
              width: 150,
              marginBottom: 4,
              marginRight: 4,
            }}
            onClick={() => {
              sendRandomPlayer(false);
            }}
          >
            Random Player to Target
          </button>
          <button
            className="button"
            style={{
              width: 150,
              marginBottom: 4,
            }}
            onClick={() => {
              sendRandomPlayer(true);
            }}
          >
            Random Player to Select
          </button>

          <hr></hr>
          <div className="outline" style={{ color: "orange" }}>
            Names:{" "}
            <button
              className="button"
              style={{
                width: 50,
                marginBottom: 4,
                marginTop: 4,
              }}
              onClick={() => {
                generateNewRandom();
              }}
            >
              Refresh
            </button>
          </div>
          <div
            className="outline"
            style={{ color: "orange", display: "flex", gap: 10 }}
          >
            <Text>{names[randomNumbersGenerated[0]]}</Text>
            <Text>{names[randomNumbersGenerated[1]]}</Text>
            <Text>{names[randomNumbersGenerated[2]]}</Text>
            <Text>{names[randomNumbersGenerated[3]]}</Text>
            <Text>{names[randomNumbersGenerated[4]]}</Text>
          </div>
          <div className="outline" style={{ color: "orange" }}>
            Locations:
          </div>
          <div
            className="outline"
            style={{ color: "orange", display: "flex", gap: 10 }}
          >
            <Text>{location[randomNumbersGenerated[5]]}</Text>
            <Text>{location[randomNumbersGenerated[6]]}</Text>
            <Text>{location[randomNumbersGenerated[7]]}</Text>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        background: "#444",
        height: 540,
        width: 550,
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: 15, paddingLeft: 20, paddingRight: 5 }}>
        <span
          className="outline"
          style={{ color: "orange", fontSize: 14, marginRight: 10 }}
        >
          | Salvage Union |
        </span>
        <Text>Search By Name: </Text>
        <input
          className="input-stat"
          style={{
            width: 150,
            color: "lightgrey",
          }}
          value={searchItems}
          onChange={(evt) => {
            if (selectedCategory === "GM") {
              setSelectedCategory("");
            }
            setSearchItems(evt.target.value);
          }}
        />
        {(searchItems !== "" || selectedCategory !== "") && (
          <button
            className="button"
            style={{ fontWeight: "bolder", width: 50 }}
            onClick={() => {
              setSearchItems("");
              setSelectedCategory("");
            }}
          >
            Clear
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          className="scrollable-container"
          style={{
            overflow: "scroll",
            height: 470,
            marginTop: 10,
            paddingLeft: 20,
            paddingRight: 5,
            width: 100,
          }}
        >
          {renderClasses()}
        </div>
        <div
          className="scrollable-container"
          style={{
            overflow: "scroll",
            height: 470,
            marginTop: 10,
            width: 400,
          }}
        >
          {selectedCategory === "GM" ? renderGM() : renderCategory()}
        </div>
      </div>

      {message !== "" && (
        <div
          style={{
            position: "absolute",
            background: "#222",
            borderRadius: 4,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
            width: 200,
            height: 28,
            padding: 8,
            textAlign: "center",
          }}
        >
          <span className="outline" style={{ fontSize: 12 }}>
            {message}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
