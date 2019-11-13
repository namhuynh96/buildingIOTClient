import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../../../store/actions";
import RadioButton from "../../../../components/UI/RadioButton/RadioButton";
import CircularProgress from "@material-ui/core/CircularProgress";

const Rooms = props => {
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

  let renderRooms = error ? (
    <h5>Rooms cannot be loaded</h5>
  ) : (
    <CircularProgress />
  );
  if (rooms) {
    if (rooms.length === 0) {
      renderRooms = <h5>No rooms in this building</h5>;
    } else {
      renderRooms = rooms.map((r, index) => (
        <div key={r._id}>
          <RadioButton
            label={r.name}
            name="room"
            value={r.name}
            changed={() => onChangeRoom(r._id)}
            checked={r._id === selectedRoomId}
          />
        </div>
      ));
    }
  }

  return <div>{renderRooms}</div>;
};

export default Rooms;
