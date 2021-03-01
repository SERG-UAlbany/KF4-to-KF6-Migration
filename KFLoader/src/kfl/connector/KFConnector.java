/*
 * KFConnector.java
 * Created on Jul 16, 2010 
 * Copyright(c) 2010 Yoshiaki Matsuzawa, Shizuoka University. All rights reserved.
 */
package kfl.connector;

import org.zoolib.ZID;
import org.zoolib.tuplebase.ZTB;

import com.knowledgeforum.k5.common.K5TBConnector;
import com.knowledgeforum.k5.common.K5TBConnector.HostInfo;
import com.knowledgeforum.k5.common.K5TBConnector.Options;

/**
 * @author macchan
 * 
 */
public class KFConnector {

	public static ZTB connect(KFLoginModel model) {
		ZTB conn;
		HostInfo host = new HostInfo(model.getHost(), model.getPort(), model.getDBName());
		Options hostOptions = new Options(1, 10);/* retryCount, interval */
		String userName = model.getUser();
		String password = model.getPassword();
		ZID[] sessionZID = { null };
		System.out.println("In connect Information"+host+" "+userName+" "+password+ " "+sessionZID);
		conn = K5TBConnector.sGetTB_HTTP_UserName(host, hostOptions, userName, password, sessionZID);
		System.out.println("Now Connection: "+ conn);
		return conn;
	}

	public static ZTB connectWithDialog(KFLoginModel model) {
		KFLoginPanel panel = new KFLoginPanel("Login to KF:");
		panel.setModel(model);
		ZTB conn = null;

		while (conn == null) {
			panel.openDialog();
			if (!panel.isOk()) {// cancel
				break;
			}

			conn = /* KFConnector. */connect(model);
			System.out.println("After Getting"+conn);
			if (conn == null) {
				panel.setFailiureMessage("Login Failed - Try Again");
			}
		}
		return conn;
	}

}
