import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../../../store/actions";
import RadioButton from "../../../../components/UI/RadioButton/RadioButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import AddRoomForm from "./RoomForm/AddRoomForm";
import ConfirmModal from "../../../../components/UI/ConfirmModal/ConfirmModal";
import UpdateRoomForm from "./RoomForm/UpdateRoomForm";

const Rooms = props => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const { selectedBuildingId } = useSelector(state => state.buildings);
  const { rooms, selectedRoomId, error } = useSelector(state => state.rooms);

  const dispatch = useDispatch();
  const onFetchRooms = useCallback(
    () =>
      selectedBuildingId && dispatch(actions.fetchRooms(selectedBuildingId)),
    [dispatch, selectedBuildingId]
  );

  useEffect(() => {
    onFetchRooms();
  }, [onFetchRooms]);

  const onChangeRoom = roomId => dispatch(actions.selectRoom(roomId));

  const deleteRoomHandler = () => {
    dispatch(actions.deleteRoom(deletingRoomId));
    setDeletingRoomId(null);
  };

  let renderRooms = error ? (
    <h5>Rooms cannot be loaded</h5>
  ) : (
    <CircularProgress />
  );
  if (rooms) {
    renderRooms = rooms.map((r, index) => (
      <div key={r._id}>
        {editingRoomId === r._id ? (
          <UpdateRoomForm
            onCancel={() => setEditingRoomId(null)}
            roomData={r}
            roomIndex={index}
            currentBuildingId={selectedBuildingId}
          />
        ) : (
          <RadioButton
            label={r.name}
            name="room"
            value={r.name}
            changed={() => onChangeRoom(r._id)}
            checked={r._id === selectedRoomId}
            onDelete={() => setDeletingRoomId(r._id)}
            onEdit={() => setEditingRoomId(r._id)}
          />
        )}
      </div>
    ));
  }

  return (
    <div>
      {selectedBuildingId && (
        <Fab
          variant="extended"
          aria-label="add"
          size="small"
          onClick={() => setIsAddingRoom(true)}
        >
          <AddIcon />
          Add Room
        </Fab>
      )}
      {isAddingRoom && (
        <AddRoomForm
          onCancel={() => setIsAddingRoom(false)}
          roomsName={rooms.map(r => r.name)}
          currentBuildingId={selectedBuildingId}
        />
      )}
      {renderRooms}
      <ConfirmModal
        show={deletingRoomId !== null}
        onCancel={() => setDeletingRoomId(null)}
        onAccept={deleteRoomHandler}
      >
        Delete room means deleting all the devices in the room
      </ConfirmModal>
    </div>
  );
};

export default Rooms;
