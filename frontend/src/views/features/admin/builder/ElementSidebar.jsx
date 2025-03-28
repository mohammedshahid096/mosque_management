import ElementLayoutCart from '@/views/components2/builder/elementSidebar/ElementLayoutCart';
import ElementsData from '@/views/components2/builder/elementSidebar/ElementsData';
import LayoutsData from '@/views/components2/builder/elementSidebar/LayoutsData';
import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidV4 } from 'uuid';
import { builderActions } from '@/redux/combineActions';
import { v4 as uuidv4 } from 'uuid';

const ElementSidebar = () => {
  const dispatch = useDispatch();
  const { setDragLayoutAction } = builderActions;

  const onDragLayoutStartFunction = (e, layout) => {
    let payload = { ...layout };
    let uuid = uuidV4();
    payload.uuid = uuid;
    payload.json = { ...payload.json, uuid };
    payload.json.block = payload.json?.block?.map((block) => ({ ...block, uuid: uuidv4() }));
    dispatch(setDragLayoutAction(payload));
  };

  const onDragElementStartFunction = (e, element) => {
    let payload = { ...element };
    let uuid = uuidV4();
    payload.uuid = uuid;
    dispatch(setDragLayoutAction(payload));
  };

  return (
    <div className="p-4 h-screen shadow-sm overflow-y-scroll">
      <h2 className="font-bold text-lg">Layouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
        {LayoutsData?.map((layout, index) => {
          return (
            <div
              key={'layout' + index}
              draggable
              onDragStart={(e) => onDragLayoutStartFunction(e, layout)}
            >
              <ElementLayoutCart label={layout.label} Icon={layout.icon} />
            </div>
          );
        })}
      </div>

      <h2 className="font-bold text-lg mt-6">Elements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
        {ElementsData?.map((element, index) => {
          return (
            <div
              key={'element' + index}
              draggable
              onDragStart={(e) => onDragElementStartFunction(e, element)}
            >
              <ElementLayoutCart label={element.label} Icon={element.icon} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElementSidebar;
