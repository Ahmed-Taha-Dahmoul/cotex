import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './FAQ.css';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  // Calculate the height of the content
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [open]);

  const springProps = useSpring({
    opacity: open ? 1 : 0,
    height: height,
    overflow: 'hidden',
    config: { duration: 300 }
  });

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <h3>{question}</h3>
        <span className={`arrow ${open ? 'open' : ''}`}>▼</span>
      </div>
      <animated.div style={springProps} className="faq-answer" ref={contentRef}>
        <p>{answer}</p>
      </animated.div>
    </div>
  );
};

const FAQ = () => {
    const faqs = [
        {
          question: 'What is Bittorrent?',
          answer: 'Bittorrent is a protocol for transferring files via p2p. Users share files with each other, connecting to each other through a server (Tracker). Once users are connected, they exchange parts of the files until they are complete. When a Bittorrent user is downloading a file, they are also uploading it at the same time, uploading only the files they are downloading. This makes Bittorrent a program capable of offering speeds far superior to its competitors and therefore the best option for downloading all types of files.'
        },
        {
          question: 'Where can I download Bittorrent?',
          answer: 'BitTorrent is open source. This means that anyone can take the source code and create their own client. Below are several clients (any of them are good):\n\n- Bitcomet: A client that offers a more than attractive combination of a clear and intuitive interface in several languages, ease of use, and fast downloads. Possibility of performing simultaneous downloads, chatting with other users, maintaining a queue of files to download, limiting upload and download speeds, port mapping, support for proxy servers, IP address filter, possibility of resuming interrupted downloads, etc.\n\n- Bittornado: A small variation of the original BitTorrent, simple but practical. Possibility of adjusting the upload speed and the number of uploads allowed, super seed, the ability to pause and resume a download, and information about the download.\n\n- uTorrent: uTorrent is a simple and efficient client that can boast of being one of the smallest of its kind. It does not even require installation, which leads to great savings in memory and processor resources. It offers various configuration options and analysis of each file.\n\n- Bitlord: Comes in several languages and an easy way to customize the settings as we want. Clean, fast, and easy to use.'
        },
        {
          question: 'How to download files with BitTorrent?',
          answer: 'First of all, to start downloading files with BitTorrents, the first thing you need to do is install a client.\n\nWhen we find a link to download on a BitTorrent website, when we click on it two things can happen:\n\n1. Our BitTorrent client opens directly and asks us where to save the file we are going to download.\n2. The .torrent file is downloaded to our PC, then we just have to open that file with our BitTorrent client for the download to begin.'
        },
        {
          question: 'Why is it important to continue sharing if I have already downloaded the file?',
          answer: 'It is very important to continue sharing the file for a while once it has been fully downloaded so that other users who are downloading it can also download it completely. It is not about sharing it indefinitely, just for a while and at the maximum possible speed, so that others can download it better. You have to be supportive; this is a P2P system and it is about giving and receiving.'
        },
        {
          question: 'What files am I sharing?',
          answer: 'In BitTorrent, not all the files in a directory are shared like other P2P services; only the files that are being downloaded are shared. This means that the entire upload speed of users is focused only on these files, which is why the speed is higher.'
        },
        {
          question: 'My download speed is very low, what can I do?',
          answer: 'Download speed depends on many factors, including:\n\n- You have to limit the upload speed to a little less than the limit of your line. If you have it set to no upload limit or with a number greater than that of your line, this can block the line and therefore the download. Example: if I have a 30 kbps upload line, then I set it to 28 kbps in the client.\n\n- If you use other P2P programs or programs that consume your bandwidth, this can cause BitTorrent not to download as it should.\n\n- You have a firewall blocking your client. Check it.\n\n- If you barely contact other users, this could be due to a problem with the tracker, or because there is nothing else. In this case, just wait.'
        },
        {
          question: 'I get an error message, what does it mean?',
          answer: 'The best thing to do in general if you\'re having trouble connecting is to wait. Sometimes trackers are unavailable or slow to respond. But it\'s usually temporary. Below are the meanings of BitTorrent error messages:\n\n- Problem getting response info – [Errno 2] No such file or directory: : The torrent saved in temporary files is not correct.\n- Error (unregistered torrent): The torrent has not been uploaded to the tracker.\n- Too many args – 0 max. : This error is indicative of a bad command line.\n- A piece failed hash check, re-downloading it: This means that you have received an incorrect part of the file so it will be downloaded again.\n- bad data from tracker: You can usually ignore this. It usually occurs when the tracker is overloaded.\n- Problem connecting to tracker – timeout exceeded: There was a problem connecting to the tracker. Trackers can be very busy and sometimes connections fail.\n- HTTP Error 400: Not Authorized: The tracker requires authorization.\n- HTTP Error 404: Not Found: It is probably an old torrent and no longer works.'
        },
        {
          question: 'How do I open the file I have downloaded?',
          answer: 'Different file types require different programs to open. Here are some common ones:\n\n- .r01, .rar, .zip, .part01, .001, .002: Use WinRAR.\n- .cbr, .cbz: Use Cdisplay or rename .CBR to .RAR and .CBZ to ZIP.\n- .par, .p01, .pnn: Use SmartPAR.\n- .nfo: Open with Notepad.\n- .avi, .mpg, .wmv, .asf: Open with a video player.\n- .mp3, .mp2, .wma, .ogg: Open with a music player.\n- .pdf: Open with Adobe Acrobat Reader.\n- VOB: Use PowerDVD or rename to .mpg.\n- .bin, .cue, .iso, .nrg, .img: Use appropriate software like Alcohol 120%, Nero, CloneCD.'
        },
        {
          question: 'What happens if I cancel a download? How do I continue?',
          answer: 'BitTorrent allows you to stop and resume a download that is halfway through. You don\'t have to do anything special. If you cancel a download before it is finished, the partial download remains on your hard drive. To resume, simply reopen the torrent and save the file to the same location where it was downloading, and your client will recognize the downloaded parts and continue.'
        },
        {
          question: 'What does all this terminology mean? seed, leecher, upload, etc.',
          answer: 'Here are the meanings of some important terms associated with BitTorrent:\n\n- Torrent: A small file with the extension .torrent that contains information about the file you want to download.\n- Peer or leechers: Users who are downloading a file from BitTorrent but have not yet completed it.\n- Seed: A user who has a full copy of a certain torrent and continues to share it.\n- Tracker: An internet server that connects clients who are downloading or uploading a file.\n- Downloading: Receiving data from another user.\n- Uploading: Sending data to another user.\n- Distributed copies: Seeds are complete copies of the file, and among all the peers, if we put all the parts of the file together, there is more than one complete copy.'
        },
        {
          question: 'Advantages of using bittorrents over other p2p?',
          answer: 'Advantages:\n\n1. Faster download speed: Since each user only uploads what they are downloading, the download speed is much faster than other P2P services where each user shares entire directories with many files.\n2. No fakes: The files we download are usually what we expect. It is very difficult to introduce fake files.\n\nDisadvantages:\n\n1. Files have a short life: The life of the file is much shorter than other P2P files due to only sharing what is being downloaded.\n2. Software: You have to use specific software to download files from torrents.'
        }
      ];

  return (
    <div className="faq-container">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </div>
  );
};

export default FAQ;
