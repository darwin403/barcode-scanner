import { useEffect, useState } from "react";
import Quagga from "quagga";

export default function Scanner(props) {
  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: 4,
        decoder: {
          readers: ["code_128_reader"],
        },
        locate: true,
      },
      function (err) {
        if (err) {
          return console.log(error);
        }
        Quagga.start();
        return () => Quagga.stop();
      }
    );

    Quagga.onDetected((result) => {
      console.log(result);
      props.onBarcode(result.codeResult.code);
    });

    return () => Quagga.stop();
  }, []);

  return <div id="interactive" className="viewport" />;
}
