import React from 'react';

import {ReactComponent as UnknowIcon} from '../../../assets/icons/types/unknown.svg'
import {ReactComponent as ZIcon} from '../../../assets/icons/types/7z.svg'
import {ReactComponent as AviIcon} from '../../../assets/icons/types/avi.svg'
import {ReactComponent as AacIcon} from '../../../assets/icons/types/aac.svg'
import {ReactComponent as DocIcon} from '../../../assets/icons/types/doc.svg'
import {ReactComponent as DocxIcon} from '../../../assets/icons/types/docx.svg'
import {ReactComponent as DocumentIcon} from '../../../assets/icons/types/document.svg'
import {ReactComponent as FlaIcon} from '../../../assets/icons/types/fla.svg'
import {ReactComponent as FlacIcon} from '../../../assets/icons/types/flac.svg'
import {ReactComponent as HtmIcon} from '../../../assets/icons/types/htm.svg'
import {ReactComponent as HtmlIcon} from '../../../assets/icons/types/html.svg'
import {ReactComponent as IsoIcon} from '../../../assets/icons/types/iso.svg'
import {ReactComponent as JpegIcon} from '../../../assets/icons/types/jpeg.svg'
import {ReactComponent as JpgIcon} from '../../../assets/icons/types/jpg.svg'
import {ReactComponent as M4vIcon} from '../../../assets/icons/types/m4v.svg'
import {ReactComponent as MkvIcon} from '../../../assets/icons/types/mkv.svg'
import {ReactComponent as MovIcon} from '../../../assets/icons/types/mov.svg'
import {ReactComponent as Mp3Icon} from '../../../assets/icons/types/mp3.svg'
import {ReactComponent as Mp4Icon} from '../../../assets/icons/types/mp4.svg'
import {ReactComponent as PdfIcon} from '../../../assets/icons/types/pdf.svg'
import {ReactComponent as PngIcon} from '../../../assets/icons/types/png.svg'
import {ReactComponent as PptIcon} from '../../../assets/icons/types/ppt.svg'
import {ReactComponent as PptxIcon} from '../../../assets/icons/types/pptx.svg'
import {ReactComponent as PsdIcon} from '../../../assets/icons/types/psd.svg'
import {ReactComponent as RarIcon} from '../../../assets/icons/types/rar.svg'
import {ReactComponent as SvgIcon} from '../../../assets/icons/types/svg.svg'
import {ReactComponent as TarIcon} from '../../../assets/icons/types/tar.svg'
import {ReactComponent as TxtIcon} from '../../../assets/icons/types/txt.svg'
import {ReactComponent as WavIcon} from '../../../assets/icons/types/wav.svg'
import {ReactComponent as WmaIcon} from '../../../assets/icons/types/wma.svg'
import {ReactComponent as WmfIcon} from '../../../assets/icons/types/wmf.svg'
import {ReactComponent as WmvIcon} from '../../../assets/icons/types/wmv.svg'
import {ReactComponent as XlsIcon} from '../../../assets/icons/types/xls.svg'
import {ReactComponent as XlsxIcon} from '../../../assets/icons/types/xlsx.svg'
import {ReactComponent as ZipIcon} from '../../../assets/icons/types/zip.svg'

const FILE_ICONS: any = {
    unknow: <UnknowIcon />,
    "7z": <ZIcon />,
    aac: <AacIcon />,
    avi: <AviIcon />,
    css: <DocumentIcon />,
    doc: <DocIcon />,
    docx: <DocxIcon />,
    fla: <FlaIcon />,
    flac: <FlacIcon />,
    htm: <HtmIcon />,
    html: <HtmlIcon />,
    iso: <IsoIcon />,
    java: <DocumentIcon />,
    jpg: <JpgIcon />,
    jpeg: <JpegIcon />,
    js: <DocumentIcon />,
    m4v: <M4vIcon />,
    mkv: <MkvIcon />,
    mov: <MovIcon />,
    mp3: <Mp3Icon />,
    png: <PngIcon />,
    pdf: <PdfIcon />,
    mp4: <Mp4Icon />,
    ppt: <PptIcon />,
    pptx: <PptxIcon />,
    psd: <PsdIcon />,
    rar: <RarIcon />,
    svg: <SvgIcon />,
    tar: <TarIcon />,
    txt: <TxtIcon />,
    wav: <WavIcon />,
    wma: <WmaIcon />,
    wmv: <WmvIcon />,
    wmf: <WmfIcon />,
    xls: <XlsIcon />,
    xlsx: <XlsxIcon />,
    zip: <ZipIcon />,
}

export default FILE_ICONS;