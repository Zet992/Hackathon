import React from "react";
import styles from "./page.module.scss";
import Header from "@/componets/header/header";
import UiForm from "@/shared/uiForm/uiForm";
import Station from "@/componets/station/station";
import Fonaru from "@/componets/fonaru/fonaru";
import Map from "@/componets/map/map";

export default function Home() {

  return <main className={styles.Main}>
		<Header/>
		<section className={styles.Section}>
			<UiForm style={styles.Section__Station}>
				<Station/>
			</UiForm>
			<UiForm style={styles.Section__Map}>
				<Map/>
			</UiForm>
			<UiForm style={styles.Section__Fonaru}>
				<Fonaru/>
			</UiForm>
		</section>
	</main>;
}
