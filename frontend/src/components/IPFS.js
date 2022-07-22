import { Web3Storage } from 'web3.storage'
// import { jsPDF } from "jspdf";
// import html2canvas from 'html2canvas'
// import ReactDOMServer from "react-dom/server"
// import ReceiptPDF from "./ReceiptPDF"
import envVar from "../.secret.json"

const api_token = envVar.WEB3_STORAGE_API_TOKEN

const uploadToIPFS = async (file, agreementAddress) => {

    // const html = ReactDOMServer.renderToStaticMarkup(<ReceiptPDF receipt={file} />)
    // const htmlObject = document.createElement('div');
    // htmlObject.innerHTML = html;

    // const svgElements = htmlObject.querySelectorAll("svg")
    // svgElements.forEach(function (item) {
    //     item.setAttribute("width", item.getBoundingClientRect().width);
    //     item.setAttribute("height", item.getBoundingClientRect().height);
    //     item.style.width = null;
    //     item.style.height = null;
    // })

    // document.body.appendChild(htmlObject)
    // const canvas = await html2canvas(htmlObject, { dpi: 144 })
    // document.body.removeChild(htmlObject)

    // const pdfImage = canvas.toDataURL("image/png")

    // const pdf = new jsPDF({ orientation: "landscape" })
    // pdf.addImage(pdfImage, "PNG", 10, 10)
    // // pdf.html(htmlObject)
    // // pdf.save()

    const storageClient = new Web3Storage({ token: api_token })

    const blob_json = new Blob([JSON.stringify(file)], { type: 'application/json' })
    // const blob_pdf = new Blob([pdf.output()], { type: 'application/pdf' })

    const files = [
        new File([blob_json], `receipt_of_agreement_${agreementAddress}.json`),
        // new File([blob_pdf], `receipt_of_agreement_${agreementAddress}.pdf`)
    ]

    const CID = await storageClient.put(files)

    return CID
}

const retrieveFromIPFS = async (CID) => {
    const storageClient = new Web3Storage({ token: api_token })
    const response = await storageClient.get(CID)

    if (!response.ok) {
        console.error(`Failed to get ${CID}`)
    } else {
        return response
    }
}

export { uploadToIPFS, retrieveFromIPFS }