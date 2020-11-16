import React from 'react';

import {ReactComponent as CodeIcon} from '../../../assets/icons/file_code.svg';
import {ReactComponent as CssIcon} from '../../../assets/icons/file_css.svg';
import {ReactComponent as CsvIcon} from '../../../assets/icons/file_csv.svg';
import {ReactComponent as ExcelIcon} from '../../../assets/icons/file_excel_office.svg';
import {ReactComponent as ExeIcon} from '../../../assets/icons/file_exe.svg';
import {ReactComponent as MusicIcon} from '../../../assets/icons/file_music.svg';
import {ReactComponent as PdfIcon} from '../../../assets/icons/file_pdf.svg';
import {ReactComponent as PicIcon} from '../../../assets/icons/file_pic.svg';
import {ReactComponent as PptIcon} from '../../../assets/icons/file_ppt_office.svg';
import {ReactComponent as TxtIcon} from '../../../assets/icons/file_txt.svg';
import {ReactComponent as UnknownIcon} from '../../../assets/icons/file_unknown.svg';
import {ReactComponent as VideoIcon} from '../../../assets/icons/file_video.svg';
import {ReactComponent as ZipIcon} from '../../../assets/icons/file_zip.svg';
import {ReactComponent as WordIcon} from '../../../assets/icons/file_word_office.svg';
import {ReactComponent as FolderIcon} from '../../../assets/icons/file_folder.svg';

const FILE_ICONS: {[key: string]: JSX.Element} = {
    java: <CodeIcon />,
    py: <CodeIcon />,
    c: <CodeIcon />,
    js: <CodeIcon />,
    ts: <CodeIcon />,
    css: <CssIcon />,
    csv: <CsvIcon />,
    xls: <ExcelIcon />,
    xlsx: <ExcelIcon />,
    exe: <ExeIcon />,
    mp3: <MusicIcon />,
    pdf: <PdfIcon />,
    jpg: <PicIcon />,
    png: <PicIcon />,
    ppt: <PptIcon />,
    txt: <TxtIcon />,
    mp4: <VideoIcon />,
    zip: <ZipIcon />,
    rar: <ZipIcon />,
    "7z": <ZipIcon />,
    doc: <WordIcon />,
    docx: <WordIcon />,
    unknown: <UnknownIcon />,
    folder: <FolderIcon />
};

export default FILE_ICONS;