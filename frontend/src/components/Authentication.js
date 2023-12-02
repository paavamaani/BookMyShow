import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addUser, removeUser } from '../utils/store/userSlice';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Authentication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUser = async () => {
    const userUid = auth.currentUser.uid;
    const docRef = doc(db, 'users', userUid);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        const userData = await getUser();
        const isAdmin = userData?.isAdmin || false;
        const isPremiumUser = userData?.isPremiumUser || false;

        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            isAdmin: isAdmin,
            isPremiumUser: isPremiumUser,
          })
        );
      } else {
        dispatch(removeUser());
        navigate('/');
      }
    });
  }, []);

  return;
};

export default Authentication;
