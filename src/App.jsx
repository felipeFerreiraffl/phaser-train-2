import { useEffect } from "react";
import Game from "./phaser/game";

export default function App() {
  useEffect(() => {
    const game = new Game();
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
}
