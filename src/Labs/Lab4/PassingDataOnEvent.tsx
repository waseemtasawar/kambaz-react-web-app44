export default function PassingDataOnEvent() {
    const add = (a: number, b: number) => {
      alert(`${a} + ${b} = ${a + b}`);
    };
    return (
      <div id="wd-passing-data-on-event">
        <h2>Passing Data on Event</h2>
        <button onClick={() => add(2, 3)} id="wd-pass-data-click">
          Pass 2 and 3 to add()
        </button>
      </div>
    );
  }